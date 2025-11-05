import Vapi from "@vapi-ai/web";

const vapiToken = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;

if (!vapiToken) {
  console.error("❌ NEXT_PUBLIC_VAPI_WEB_TOKEN is not set!");
} else {
  console.log("✅ Vapi SDK initialized with token:", vapiToken.substring(0, 10) + "...");
}

export const vapi = new Vapi(vapiToken!);
