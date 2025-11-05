"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");

  useEffect(() => {
    console.log("Agent component mounted, setting up Vapi event listeners");
    
    const onCallStart = () => {
      console.log("✅ Call started!");
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      console.log("✅ Call ended!");
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      console.log("📨 Message received:", message);
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("🔊 Speech started");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("🔇 Speech ended");
      setIsSpeaking(false);
    };

    const onError = (error: any) => {
      console.error("❌ Vapi Error:", error);
      console.error("❌ Error details:", {
        message: error?.message,
        name: error?.name,
        code: error?.code,
        type: error?.type,
        status: error?.status,
        statusText: error?.statusText,
        response: error?.response,
        data: error?.data,
        stack: error?.stack,
        fullError: JSON.stringify(error, Object.getOwnPropertyNames(error)),
      });
      
      // Try to extract meaningful error message
      const errorMessage = 
        error?.message || 
        error?.data?.message || 
        error?.response?.data?.message ||
        error?.code ||
        error?.name ||
        "Unknown error - Check browser console for details";
      
      alert(`Vapi Error: ${errorMessage}\n\nCheck browser console (F12) for full error details.`);
      setCallStatus(CallStatus.INACTIVE);
    };

    console.log("Registering Vapi event listeners...");
    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);
    
    console.log("✅ Vapi event listeners registered");

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      console.log("handleGenerateFeedback");

      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages,
        feedbackId,
      });

      if (success && id) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.log("Error saving feedback");
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    try {
      if (type === "generate") {
        const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;
        
        if (!workflowId) {
          console.error("NEXT_PUBLIC_VAPI_WORKFLOW_ID is not set in .env.local");
          alert("Vapi Workflow ID is not configured. Please set NEXT_PUBLIC_VAPI_WORKFLOW_ID in your .env.local file.");
          setCallStatus(CallStatus.INACTIVE);
          return;
        }

        console.log("🚀 Starting Vapi workflow:", workflowId);
        console.log("📝 Variable values:", { username: userName, userid: userId });
        console.log("🔑 Vapi token:", process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN ? "Set" : "Missing");
        console.log("🔍 Workflow ID type:", typeof workflowId);
        console.log("🔍 Workflow ID length:", workflowId?.length);

        // Verify workflow ID format (should be a UUID)
        if (!workflowId || typeof workflowId !== 'string') {
          alert("Invalid Workflow ID. Please check NEXT_PUBLIC_VAPI_WORKFLOW_ID in your environment variables.");
          setCallStatus(CallStatus.INACTIVE);
          return;
        }

        try {
          // Vapi 2.0: Start workflow with object format
          console.log("📞 Calling vapi.start() with workflow ID:", workflowId);
          const result = await vapi.start({
            workflowId: workflowId,
            variableValues: {
              username: userName || "User",
              userid: userId || "unknown",
            },
          } as any);
          console.log("✅ Vapi.start() completed:", result);
        } catch (startError: any) {
          console.error("❌ Error in vapi.start():", startError);
          console.error("❌ Full error object:", JSON.stringify(startError, null, 2));
          throw startError;
        }
      } else {
        // For interview type, use assistant (not workflow)
        let formattedQuestions = "";
        if (questions) {
          formattedQuestions = questions
            .map((question) => `- ${question}`)
            .join("\n");
        }

        // Vapi 2.0: Start assistant with object format
        console.log("📞 Starting interview with assistant");
        await vapi.start({
          assistant: interviewer,
          variableValues: {
            questions: formattedQuestions,
          },
        } as any);
      }
    } catch (error: any) {
      console.error("❌ Error starting Vapi call:", error);
      console.error("❌ Error details:", {
        message: error?.message,
        name: error?.name,
        code: error?.code,
        stack: error?.stack,
        fullError: error,
      });
      alert(`Failed to start call: ${error?.message || error?.name || "Unknown error"}\n\nCheck browser console for details.`);
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <>
      <div className="call-view">
        {/* AI Interviewer Card */}
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="profile-image"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        {/* User Profile Card */}
        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="profile-image"
              width={539}
              height={539}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button className="relative btn-call" onClick={() => handleCall()}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />

            <span className="relative">
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Call"
                : ". . ."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={() => handleDisconnect()}>
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
