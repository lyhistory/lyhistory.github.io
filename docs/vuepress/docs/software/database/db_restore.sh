#!/bin/bash - 
# Shell script to restore MySQL database

# Set Variables
V_USER="root"
V_SOURCE="/opt/backup/"

MYSQL="$(which mysql)"
MYSQLADMIN="$(which mysqladmin)"

pushd ${V_SOURCE} &> /dev/null

if [ $# -eq 0 ]
  then
    echo "Please speicifed the date, USAGE:./db_restore 20200101"
    exit 0
fi

# Look for sql.gz files:
if [ "$(ls -A $1.tar.gz 2> /dev/null)" ]  ; then
  echo "sql.gz files found extracting..."
  tar -zxvf $1.tar.gz
else
  echo "target file $1.tar.gz not found in ${V_SOURCE}"
  exit 0
fi
pushd ${V_SOURCE}/$1/mysql &> /dev/null
# Exit when folder doesn't have .sql files:
if [ "$(ls -A *.sql 2> /dev/null | wc -l)" == 0 ]; then
  echo "No *.sql files found in $(pwd)"
  exit 0
fi

# Read mysql root password:
echo -n "Type mysql $V_USER password: "
read -s V_PASS
echo ""


# Get all database list first
DBS="$($MYSQL -u$V_USER -p$V_PASS -Bse 'show databases')"

# Ignore list, won't restore the following list of DB:
SKIP="db2"


# Restore DBs:
for filename in *.sql
do
  dbname=${filename%.sql}
  
  skipdb=-1
  if [ "$SKIP" != "" ]; then
    for ignore in $SKIP
    do
        [ "$dbname" == "$ignore" ] && skipdb=1 || :
        
    done
  fi      

  # If not in ignore list, restore:
  if [ "$skipdb" == "-1" ] ; then
  
    skip_create=-1
    for existing in $DBS
    do      
      [ "$dbname" == "$existing" ] && skip_create=1 || :
    done
  
    if [ "$skip_create" ==  "1" ] ; then 
      echo "Database: $dbname already exist, skiping create"
    else
      echo "Creating DB: $dbname"
      #mysqladmin create $dbname -u $V_USER -p$V_PASS
    fi
    
    echo "Importing DB: $dbname from $filename"
    #mysql $dbname < $filename -u $V_USER -p$V_PASS
  fi    
done
