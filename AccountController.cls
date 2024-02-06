public with sharing class AccountController {
    @AuraEnabled(cacheable=true)
    public static List<ContentDocument> getFiles() {
        return [SELECT Title,Id,OwnerId,LastModifiedDate FROM ContentDocument ];
    }
    @AuraEnabled(cacheable=true)
    public static List<ContentWorkspace> getLibraries() {
        return [SELECT Name, Id FROM ContentWorkspace];
    }
    @AuraEnabled
public static String createLibrary(String libraryName) {
    try {
        // Create a new ContentWorkspace with the specified name
        ContentWorkspace newWorkspace = new ContentWorkspace(
            Name = libraryName
        );

        // Insert the new ContentWorkspace
        insert newWorkspace;

        // Return a success message or any additional information
        return 'Library created successfully.';
    } catch (Exception e) {
        // Log the exception message
        System.debug('Error creating library: ' + e.getMessage());

        // Return the exception message for better troubleshooting
        return 'Error creating library: ' + e.getMessage();
    }
}
@AuraEnabled
    public static String deleteLib(String workspaceId) {
        try {
            // Fetch the ContentDocumentIds associated with the library
            List<ContentWorkspaceDoc> contentWorkspaceDocs = [SELECT ContentDocumentId FROM ContentWorkspaceDoc WHERE ContentWorkspaceId = :workspaceId];
            ContentWorkspace workspaceToDelete = [
                SELECT Id
                FROM ContentWorkspace
                WHERE Id = :workspaceId
                LIMIT 1
            ];
            List<Id> contentDocumentIds = new List<Id>();
            for (ContentWorkspaceDoc doc : contentWorkspaceDocs) {
                contentDocumentIds.add(doc.ContentDocumentId);
            }

            System.debug('contentDocumentIds: ' + contentDocumentIds);

            // // Delete the library
            // delete new ContentWorkspace(Id = workspaceId);

            // Delete the associated files
            if (!contentDocumentIds.isEmpty()) {
                System.debug('Deleting ContentDocuments...');
                delete [SELECT Id FROM ContentDocument WHERE Id IN :contentDocumentIds];  
            }
            // Delete the library
            delete workspaceToDelete;


            return 'Success';
        } catch (Exception e) {
            System.debug('Error: ' + e.getMessage());
            return 'Error: ' + e.getMessage();
        }
    }
    @AuraEnabled(cacheable=true)
    public static List<ContentDocument> getFilesByLibrary(String libraryId) {
        // Query to retrieve ContentDocuments related to the given libraryId
        List<ContentDocumentLink> documentLinks = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :libraryId];

        // Extract ContentDocumentIds from the ContentDocumentLinks
        Set<Id> documentIds = new Set<Id>();
        for (ContentDocumentLink link : documentLinks) {
            documentIds.add(link.ContentDocumentId);
        }

        // Query to retrieve ContentDocuments based on the ContentDocumentIds
        List<ContentDocument> files = [SELECT Id, Title, FileType, ContentSize FROM ContentDocument WHERE Id IN :documentIds];

        return files;
    }
    @AuraEnabled(cacheable=true)
    public static List<String> getFileTypeOptions() {
        List<String> picklistValues = new List<String>();
        Schema.DescribeFieldResult fieldResult = File_Type__mdt.Type__c.getDescribe();
        List<Schema.PicklistEntry> picklistEntries = fieldResult.getPicklistValues();

        for(Schema.PicklistEntry entry : picklistEntries) {
            picklistValues.add(entry.getValue());
        }
        return picklistValues;
    }
}