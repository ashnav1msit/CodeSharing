There are 5 statuses for an application and these statues are implied based on the state of the application. There is no lookup or column that defines the status. Refer to the following table on how application status is determined.

| Status             | Condition                                                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| New                | Application created, but no notification sent (notification date not set)                                                            |
| Student Notified   | Notification sent, waiting for student to fill out application (notification date set, submission application is empty)              |
| Pending Assessment | Application filled out by student, waiting for staff to review (submission application set, waiting for internal assessment profile) |
| Needs Review       | Warning generated from assessment engine                                                                                             |
| Complete           | No warnings generated from assessment                                                                                                |
