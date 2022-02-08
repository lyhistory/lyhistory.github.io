https://infocenter.sybase.com/help/index.jsp?topic=/com.sybase.infocenter.dc01963.0510/doc/html/psh1360346725201.html

Asterisks (*)

question mark ( ? ) 

https://crontab.guru/



## crontab

cron is a basic utility available on Unix-based systems. 

```
<minute> <hour> <day-of-month> <month> <day-of-week> <command>


```

- *** (all)** specifies that event should happen for every time unit. For example, “*” in the <*minute>* field means “for every minute.”
- **? (any)** is utilized in the <*day-of-month>* and <*day-of -week>* fields to denote the arbitrary value and thus neglect the field value. For example, if we want to fire a script at “5th of every month” irrespective of what day of the week falls on that date, we specify a “?” in the <*day-of-week>* field.
- **– (range)** determines the value range. For example, “10-11” in the *<hour>* field means “10th and 11th hours.”
- **, (values)** specifies multiple values. For example, “MON, WED, FRI*“* in <*day-of-week>* field means on the days “Monday, Wednesday and Friday.”
- **/ (increments)** specifies the incremental values. For example, a “5/15” in the <*minute>* field means at “5, 20, 35 and 50 minutes of an hour.”
- **L (last)** has different meanings when used in various fields. For example, if it's applied in the <*day-of-month>* field, it means last day of the month, i.e. “31st of January” and so on as per the calendar month. It can be used with an offset value, like “L-3”, which denotes the “third to last day of the calendar month.” In <*day-of-week>*, it specifies the “last day of a week.” It can also be used with another value in <*day-of-week>*, like “6L”, which denotes the “last Friday.”
- **W (weekday)** determines the weekday (Monday to Friday) nearest to a given day of the month. For example, if we specify “10W” in the <*day-of-month>* field, it means the “weekday near to 10th of that month.” So if “10th” is a Saturday, the job will be triggered on “9th,” and if “10th” is a Sunday, it will trigger on “11th.” If we specify “1W” in <*day-of-month>* and if “1st” is Saturday, the job will be triggered on “3rd,” which is Monday, and it will not jump back to the previous month.
- **#** specifies the “N-th” occurrence of a weekday of the month, for example, “third Friday of the month” can be indicated as “6#3”.

## spring sheduler job

https://stackoverflow.com/questions/30887822/spring-cron-vs-normal-cron?rq=1

Spring Scheduled tasks are *not* in the same format as cron expressions.

They don't follow the same format as UNIX cron expressions.

There are only 6 fields:

- second,
- minute,
- hour,
- day of month,
- month,
- day(s) of week.

https://stackoverflow.com/questions/30887822/spring-cron-vs-normal-cron?rq=1