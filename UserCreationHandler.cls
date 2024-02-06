public class UserCreationHandler {
    public static void createUser(List<Team_Member__c> newTeamMembers) {
        List<User> userList = new List<User>();
        Set<String> existingEmployeeIds = new Set<String>(); // Store existing Employee IDs

        // Fetch existing users' Employee IDs
        for (User existingUser : [SELECT Project_ID__c FROM User WHERE Project_ID__c IN :getEmployeeIds(newTeamMembers)]) {
            existingEmployeeIds.add(existingUser.Project_ID__c);
        }

        List<Profile> profileList = [SELECT Id FROM Profile WHERE Name = 'Identity User'];

        for(Team_Member__c Team : newTeamMembers) {
            // Check if Employee ID already exists, if so, skip creating the user
            if (existingEmployeeIds.contains(Team.Employee__c)) {
                continue;
            }

            User u = new User();
            u.LastName = Team.Name;
            u.Email = Team.Email__c;
            u.Username = Team.Name + Team.Project__c + '8@gmail.com';
            u.Alias = 'test';
            u.IsActive = true;
            u.TimeZoneSidKey = 'GMT';
            u.LanguageLocaleKey = 'en_US';
            u.EmailEncodingKey = 'UTF-8';
            u.LocaleSidKey = 'en_US';
            u.Project_ID__c = Team.Employee__c;

            if(profileList.size() > 0) {
                u.ProfileId = profileList[0].Id;
                userList.add(u);
            }
        }

        insert userList;
    }

    // Helper method to get unique Employee IDs from Team_Member__c records
    private static Set<String> getEmployeeIds(List<Team_Member__c> teamMembers) {
        Set<String> employeeIds = new Set<String>();
        for (Team_Member__c member : teamMembers) {
            employeeIds.add(member.Employee__c);
        }
        return employeeIds;
    }
}