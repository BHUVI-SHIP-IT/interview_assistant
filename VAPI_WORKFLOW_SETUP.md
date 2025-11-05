# Vapi Workflow Setup Guide

This guide will walk you through creating the interview generation workflow manually in the Vapi dashboard, step by step.

## Prerequisites

1. **Vapi Account**: Sign up at [https://dashboard.vapi.ai](https://dashboard.vapi.ai)
2. **Vapi API Token**: Get your API token from the Vapi dashboard (Settings → API Keys)
3. **Base URL**: Your deployed app URL or ngrok URL for local testing
4. **Environment Variables**: Make sure you have `NEXT_PUBLIC_VAPI_WEB_TOKEN` set in your `.env.local`

---

## Step 1: Access Vapi Dashboard

1. Go to [https://dashboard.vapi.ai](https://dashboard.vapi.ai)
2. Log in to your account
3. Navigate to **Workflows** in the left sidebar
4. Click **+ Create Workflow** or **New Workflow**

---

## Step 2: Configure Workflow Settings

1. **Workflow Name**: Enter `ai_interview_workflow`
2. **Model Configuration**:
   - **Provider**: Select `OpenAI`
   - **Model**: Select `gpt-4`
   - **Temperature**: Set to `0.7`
   - **Max Tokens**: Set to `200`

3. **Voice Configuration**:
   - **Provider**: Select `11labs`
   - **Voice ID**: Select `sarah`
   - **Stability**: Set to `0.4`
   - **Similarity Boost**: Set to `0.8`
   - **Speed**: Set to `0.9`
   - **Style**: Set to `0.5`
   - **Use Speaker Boost**: Enable this option

4. **Global Prompt**: 
   ```
   You are a friendly AI assistant helping users prepare for job interviews. Your goal is to collect information about the job role, experience level, interview type, tech stack, and number of questions they want. Be conversational, brief, and helpful. Guide users through the process naturally.
   ```

---

## Step 3: Create the Introduction Node

1. **Click "Add Node"** or the "+" button
2. **Node Type**: Select `Conversation`
3. **Node Name**: `introduction`
4. **Mark as Start Node**: ✅ Check this box (this makes it the entry point)
5. **First Message**: 
   ```
   Hello {{username}}! Let's prepare your interview. I'll ask you a few questions and generate a perfect interview just for you. Are you ready?
   ```
6. **Prompt**: Leave empty (global prompt will be used)
7. **Save** the node

---

## Step 4: Create the Collect Role Node

1. **Add a new Conversation node**
2. **Node Name**: `collect_role`
3. **First Message**: 
   ```
   What job role are you interviewing for?
   ```
4. **Prompt**:
   ```
   Ask the user what job role they are interviewing for. Examples: Frontend Developer, Backend Developer, Full Stack Developer, Data Scientist, etc. Keep it brief and friendly. Extract the role from their response and store it in a variable called 'role'.
   ```
5. **Variable Extraction**:
   - In the node settings, look for **Variable Extraction** or **Output Variables**
   - Add a variable: Name = `role`, Type = `string`
   - This will automatically extract the role from the conversation
6. **Save** the node

---

## Step 5: Create the Collect Level Node

1. **Add a new Conversation node**
2. **Node Name**: `collect_level`
3. **First Message**: 
   ```
   What's your experience level? Are you a Junior, Mid-level, or Senior professional?
   ```
4. **Prompt**:
   ```
   Ask the user about their experience level. Options are: Junior, Mid, or Senior. Make it conversational and help them choose. Normalize the answer to 'Junior', 'Mid', or 'Senior' and store it in a variable called 'level'.
   ```
5. **Variable Extraction**:
   - Add variable: Name = `level`, Type = `string`
   - Optionally, add validation to ensure it's one of: Junior, Mid, Senior
6. **Save** the node

---

## Step 6: Create the Collect Type Node

1. **Add a new Conversation node**
2. **Node Name**: `collect_type`
3. **First Message**: 
   ```
   What type of interview questions would you like? Technical, Behavioural, or Mixed?
   ```
4. **Prompt**:
   ```
   Ask the user what type of interview questions they want. Options are: Technical (focus on technical skills), Behavioural (focus on soft skills and past experiences), or Mixed (combination of both). Keep it brief. Normalize the answer to 'Technical', 'Behavioural', or 'Mixed' and store it in a variable called 'type'.
   ```
5. **Variable Extraction**:
   - Add variable: Name = `type`, Type = `string`
6. **Save** the node

---

## Step 7: Create the Collect Techstack Node

1. **Add a new Conversation node**
2. **Node Name**: `collect_techstack`
3. **First Message**: 
   ```
   What technologies or tech stack are relevant to this role? You can mention multiple technologies separated by commas.
   ```
4. **Prompt**:
   ```
   Ask the user about the tech stack or technologies relevant to the role. They can mention multiple technologies separated by commas. Examples: React, TypeScript, Node.js or Python, Django, PostgreSQL. Keep it conversational. Store the answer in a variable called 'techstack'.
   ```
5. **Variable Extraction**:
   - Add variable: Name = `techstack`, Type = `string`
6. **Save** the node

---

## Step 8: Create the Collect Amount Node

1. **Add a new Conversation node**
2. **Node Name**: `collect_amount`
3. **First Message**: 
   ```
   How many interview questions would you like? I recommend between 5 to 15 questions.
   ```
4. **Prompt**:
   ```
   Ask the user how many interview questions they want. Suggest a range like 5 to 15 questions. Keep it brief. Store the number in a variable called 'amount'.
   ```
5. **Variable Extraction**:
   - Add variable: Name = `amount`, Type = `number` (or string, depending on Vapi's options)
6. **Save** the node

---

## Step 9: Create the API Request Node (Generate Interview)

1. **Add a new node**
2. **Node Type**: Select `API Request` or `HTTP Request` (depending on Vapi's naming)
3. **Node Name**: `generate_interview`
4. **URL**: 
   - For production: `https://your-domain.com/api/vapi/generate`
   - For local testing: `https://your-ngrok-url.ngrok.io/api/vapi/generate`
   - Replace `your-domain.com` with your actual domain
   - **📖 See `PRODUCTION_DEPLOYMENT.md` for detailed deployment instructions**
5. **Method**: Select `POST`
6. **Body** (configure as JSON):
   - Click "Add Body" or "Configure Body"
   - Select "JSON" format
   - Add the following fields (use variable references):
     ```json
     {
       "type": "{{type}}",
       "role": "{{role}}",
       "level": "{{level}}",
       "techstack": "{{techstack}}",
       "amount": "{{amount}}",
       "userid": "{{userid}}"
     }
     ```
   - Note: `{{userid}}` comes from the variableValues passed when starting the workflow (already configured in your code)
7. **Response Handling** (if available):
   - Map response fields if needed
   - The API returns: `{ "success": true, "interviewId": "..." }`
8. **Save** the node

---

## Step 10: Create the Completion Node

1. **Add a new Conversation node**
2. **Node Name**: `completion`
3. **First Message**: 
   ```
   Perfect! I've generated your personalized interview questions based on your preferences. You can now start practicing your interview. Good luck!
   ```
4. **Prompt**:
   ```
   Thank the user and confirm that their interview has been generated successfully. Let them know they can now proceed to practice the interview. Keep it brief and friendly.
   ```
5. **Save** the node

---

## Step 11: Connect the Nodes (Create Edges)

Now you need to connect all nodes in sequence:

1. **Introduction → Collect Role**:
   - Click on the `introduction` node
   - Drag a connection line to `collect_role` node
   - Or use the "Add Edge" button
   - Condition: Always (or no condition needed)

2. **Collect Role → Collect Level**:
   - Connect `collect_role` to `collect_level`
   - Condition: Variable `role` exists (if Vapi supports variable-based transitions)

3. **Collect Level → Collect Type**:
   - Connect `collect_level` to `collect_type`
   - Condition: Variable `level` exists

4. **Collect Type → Collect Techstack**:
   - Connect `collect_type` to `collect_techstack`
   - Condition: Variable `type` exists

5. **Collect Techstack → Collect Amount**:
   - Connect `collect_techstack` to `collect_amount`
   - Condition: Variable `techstack` exists

6. **Collect Amount → Generate Interview**:
   - Connect `collect_amount` to `generate_interview`
   - Condition: Variable `amount` exists

7. **Generate Interview → Completion**:
   - Connect `generate_interview` to `completion`
   - Condition: Always (or API success)

**Note**: If Vapi doesn't support variable-based edge conditions, you can use "Always" for all transitions and rely on the conversation flow.

---

## Step 12: Configure Workflow Variables

1. Go to **Workflow Settings** or **Variables** section
2. Ensure the following variables are available:
   - `username` (passed from frontend)
   - `userid` (passed from frontend)
   - `role` (extracted from conversation)
   - `level` (extracted from conversation)
   - `type` (extracted from conversation)
   - `techstack` (extracted from conversation)
   - `amount` (extracted from conversation)

3. **Variable Types**:
   - `username`: string (from variableValues)
   - `userid`: string (from variableValues)
   - `role`: string (extracted)
   - `level`: string (extracted)
   - `type`: string (extracted)
   - `techstack`: string (extracted)
   - `amount`: number or string (extracted)

---

## Step 13: Test the Workflow

1. Click **Test** or **Preview** button in the workflow editor
2. Enter test values:
   - username: "John"
   - userid: "test-user-123"
3. Start the test conversation
4. Verify:
   - Each question is asked in sequence
   - Variables are extracted correctly
   - API request is made with correct data
   - Completion message is shown

---

## Step 14: Save and Deploy

1. Click **Save** to save your workflow
2. Click **Deploy** or **Publish** (if available)
3. **Copy the Workflow ID** from the workflow page
4. Add it to your `.env.local`:
   ```
   NEXT_PUBLIC_VAPI_WORKFLOW_ID=your-workflow-id-here
   ```

---

## Step 15: Update Your Code

Your `Agent.tsx` already has the code to start the workflow:

```typescript
await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
  variableValues: {
    username: userName,
    userid: userId,
  },
});
```

The workflow will automatically:
1. Use `username` and `userid` from variableValues
2. Collect all other information through conversation
3. Call your API endpoint
4. Complete the flow

---

## Troubleshooting

### Issue: Variables not being extracted
**Solution**: 
- Check that Variable Extraction is enabled in each conversation node
- Verify the prompt instructs the AI to extract the variable
- Test with explicit examples in the prompt

### Issue: API Request failing
**Solution**:
- Verify the URL is correct and accessible
- Check that your API endpoint is running
- Ensure CORS is configured if needed
- Check the body format matches your API expectations

### Issue: Workflow not progressing
**Solution**:
- Check edge conditions are set correctly
- Verify all required variables are available
- Test each node individually

### Issue: Variables not available in API request
**Solution**:
- Ensure variables are extracted before the API request node
- Check variable names match exactly (case-sensitive)
- Verify variable scope is set correctly

---

## Alternative: Using Function Node Instead of API Request

If Vapi supports Function nodes, you can use that instead:

1. **Create a Function Node**:
   - Name: `generateInterview`
   - Add function definition with parameters matching your API
   - Configure server URL to your API endpoint
   - Map parameters to variables

2. **Function Definition**:
   - Parameters: `type`, `role`, `level`, `techstack`, `amount`, `userid`
   - Server URL: Your API endpoint
   - Method: POST
   - Body: Map variables to function parameters

---

## Important Notes

1. **API URL**: Make sure your API endpoint is publicly accessible (use ngrok for local development)
2. **Variable Names**: Keep variable names consistent throughout the workflow
3. **Error Handling**: Consider adding error handling nodes if Vapi supports them
4. **Testing**: Always test thoroughly before deploying to production
5. **Documentation**: Keep notes of any custom configurations you make

---

## Next Steps

After setting up the workflow:

1. Test it thoroughly in the Vapi dashboard
2. Update your `.env.local` with the Workflow ID
3. Restart your Next.js dev server
4. Test the full flow in your application
5. Monitor API calls and responses

---

## Support

If you encounter issues:
1. Check Vapi documentation: [https://docs.vapi.ai](https://docs.vapi.ai)
2. Review Vapi dashboard tooltips and help sections
3. Check your API endpoint logs for errors
4. Verify all environment variables are set correctly

---

**Good luck with your workflow setup!** 🚀

