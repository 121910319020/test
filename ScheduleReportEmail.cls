global class ScheduleReportEmail implements Schedulable {
    global void execute(SchedulableContext sc) {
        ReportEmail.sendreport();
        
    }
}