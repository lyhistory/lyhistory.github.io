#!/bin/bash
# Shell script to backup MySQL database

# Set variables
V_USER="root"	# DB_USERNAME
V_PASS="123456"	# DB_PASSWORD

V_DBS="db1
db2"

V_DEST="/opt/backup/" # Backup Dest directory
V_DAYS=365 # How many days old files must be to be removed

# Linux bin paths
MYSQL="$(which mysql)"
MYSQLDUMP="$(which mysqldump)"
GZIP="$(which gzip)"

# Create Backup sub-directories
NOW="$(date +"%Y%m%d")"
MBD="$V_DEST/$NOW/mysql"
install -d $MBD


# Archive database dumps
for db in $V_DBS
do
    FILE="$MBD/$db.sql"
    echo "Start to backup $db ...."
    $MYSQLDUMP -u$V_USER -p$V_PASS $db > $FILE
    echo "Done!"
done

# Archive the directory, send mail and cleanup
cd $V_DEST
tar -cf $NOW.tar $NOW
$GZIP -9 $NOW.tar

echo "MySQL backup is completed! Backup name is $NOW.tar.gz"
#echo "MySQL backup is completed! Backup name is $NOW.tar.gz" | mail -s "MySQL backup" $EMAIL
rm -rf $NOW

# Remove old files
find $V_DEST -mtime +$V_DAYS -exec rm -f {} \;

