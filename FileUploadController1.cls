public with sharing class FileUploadController1{
    @AuraEnabled
    public static String uploadFile(String base64Data, String fileName, String recordId) {
        try {
            // Convert the base64 data to Blob
            Blob fileBlob = EncodingUtil.base64Decode(base64Data);

            // Create a new ContentVersion record
            ContentVersion newFile = new ContentVersion();
            newFile.VersionData = fileBlob;
            newFile.Title = fileName;
            newFile.PathOnClient = '/' + fileName;
            newFile.FirstPublishLocationId = recordId;

            insert newFile;

            // Return the ContentDocumentId of the uploaded file
            return newFile.ContentDocumentId;
        } catch (Exception e) {
            // Handle exceptions as needed
            return e.getMessage();
        }
    }
}