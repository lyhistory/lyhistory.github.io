修改元数据时间

```
"exiftool(-k).exe" -api "QuickTimeUTC" "-CreateDate=2020:08:22 21:25:57+08:00" test.jpg

"exiftool(-k).exe" -api "QuickTimeUTC" "-MediaCreateDate=2020:08:22 21:25:57+08:00" test.jpg

"exiftool(-k).exe" -api "QuickTimeUTC" "-TrackCreateDate=2020:08:22 21:25:57+08:00" test.jpg

"exiftool(-k).exe" -api "QuickTimeUTC" "-FileCreateDate=2020:08:22 21:12:57+08:00" test.jpg

"exiftool(-k).exe" -api "QuickTimeUTC" "-FileModifyDate=2020:08:22 21:12:57+08:00" test.jpg
```

