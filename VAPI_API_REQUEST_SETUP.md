# Vapi API Request Node Configuration Guide

This guide will help you configure the API Request node in your Vapi workflow for the interview generation endpoint.

## Overview

Your API endpoint expects a POST request to `/api/vapi/generate` with the following structure:
- **URL**: `https://your-production-url.com/api/vapi/generate`
- **Method**: `POST`
- **Body**: JSON with interview parameters
- **Response**: JSON with success status and interview ID

---

## Step 1: Request Headers

**Click on "Request Headers" to expand**

You typically don't need custom headers for this API, but if you want to add authentication later:

1. **Click "Add Header"** (if needed)
2. **Header Name**: `Content-Type`
3. **Header Value**: `application/json`

**Note**: Vapi usually handles `Content-Type` automatically, so you can leave this empty or skip it.

**Action**: Leave Request Headers empty for now (or add Content-Type if the option is available).

---

## Step 2: Request Body

**Click on "Request Body" to expand**

This is the most important section. You need to define the structure of the data you're sending to your API.

### Option A: Using Schema Builder (Recommended)

1. **Click "Add Field"** or use the schema builder
2. Add the following fields one by one:

   **Field 1: type**
   - **Name**: `type`
   - **Type**: `string`
   - **Value**: `{{type}}` (use the variable from your workflow)
   - **Required**: ✅ Yes

   **Field 2: role**
   - **Name**: `role`
   - **Type**: `string`
   - **Value**: `{{role}}`
   - **Required**: ✅ Yes

   **Field 3: level**
   - **Name**: `level`
   - **Type**: `string`
   - **Value**: `{{level}}`
   - **Required**: ✅ Yes

   **Field 4: techstack**
   - **Name**: `techstack`
   - **Type**: `string`
   - **Value**: `{{techstack}}`
   - **Required**: ✅ Yes

   **Field 5: amount**
   - **Name**: `amount`
   - **Type**: `string` or `number` (check what Vapi supports)
   - **Value**: `{{amount}}`
   - **Required**: ✅ Yes

   **Field 6: userid**
   - **Name**: `userid`
   - **Type**: `string`
   - **Value**: `{{userid}}`
   - **Required**: ✅ Yes

### Option B: Using Raw JSON

If Vapi supports raw JSON input:

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

**Important Notes**:
- Use `{{variableName}}` syntax to reference workflow variables
- Make sure all variable names match exactly (case-sensitive)
- The `userid` variable comes from `variableValues` when starting the workflow

---

## Step 3: Response Body

**Click on "Response Body" to expand**

This section maps the API response to workflow variables. Your API returns:

```json
{
  "success": true,
  "interviewId": "some-document-id"
}
```

### Configure Response Mapping:

1. **Click "Add Mapping"** or "Add Variable"

   **Mapping 1: success**
   - **Response Field**: `success`
   - **Variable Name**: `generation_success` (or any name you prefer)
   - **Type**: `boolean`
   - **Description**: "Whether the interview was generated successfully"

   **Mapping 2: interviewId**
   - **Response Field**: `interviewId`
   - **Variable Name**: `generated_interview_id` (or any name you prefer)
   - **Type**: `string`
   - **Description**: "The ID of the generated interview"

**Note**: These variables can be used in subsequent nodes if needed, but for now you mainly need them for error handling.

---

## Step 4: Aliases (Optional)

**Click on "Aliases" to expand**

Aliases allow you to rename response fields. You typically don't need this for your use case.

**Action**: Leave this section empty or skip it.

---

## Step 5: Messages Configuration

**Click on "Messages Configuration" to expand**

This section configures how the AI talks about the API call.

### System Message (if available):
```
The interview questions have been generated successfully. Inform the user that their personalized interview is ready.
```

### User Message (if available):
```
I've generated your interview questions based on your preferences.
```

**Note**: This section might not be available in all Vapi versions. If it's not there, you can handle messaging in the next conversation node.

---

## Complete Configuration Summary

### Your API Request Node Should Have:

1. **URL**: `https://your-production-url.com/api/vapi/generate`
   - Replace with your actual production URL
   - For testing: Use ngrok URL like `https://abc123.ngrok.io/api/vapi/generate`

2. **Method**: `POST`

3. **Request Body** (6 fields):
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

4. **Response Mapping** (2 fields):
   - `success` → `generation_success`
   - `interviewId` → `generated_interview_id`

---

## Testing Your Configuration

After configuring:

1. **Save the node**
2. **Test the workflow** in Vapi dashboard
3. **Check the API call**:
   - Go through the conversation
   - Verify the API is called with correct data
   - Check your API endpoint logs
   - Verify interview is created in Firestore

---

## Troubleshooting

### Issue: Variables not being sent
**Solution**: 
- Verify variable names match exactly (case-sensitive)
- Check that variables are extracted in previous nodes
- Test each variable individually

### Issue: API returns error
**Solution**:
- Check your API endpoint is accessible
- Verify all environment variables are set in production
- Check API logs for specific errors
- Ensure request body format matches your API expectations

### Issue: Response not mapping correctly
**Solution**:
- Verify response field names match exactly
- Check that your API returns the expected JSON structure
- Test the API endpoint directly with Postman/curl first

---

## Quick Checklist

Before saving:
- [ ] URL is set correctly (production or ngrok)
- [ ] Method is POST
- [ ] All 6 request body fields are configured
- [ ] Variable references use `{{variableName}}` syntax
- [ ] Response mapping is configured (optional but recommended)
- [ ] Node is saved

---

## Next Steps

After configuring the API Request node:
1. Connect it to the completion node
2. Test the complete workflow
3. Deploy and update your production URL
4. Monitor API calls and responses

---

**Need more help?** Refer to the main [Vapi Workflow Setup Guide](./VAPI_WORKFLOW_SETUP.md) for complete workflow configuration.

