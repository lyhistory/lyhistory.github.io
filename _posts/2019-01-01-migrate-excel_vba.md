---
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
title: Excel & VBA
---

tips: copy and paste as value/formula/transpose(row to column, column to row)

Sheet and cell: =Sheet1!$A$2:$A$8

### 1.How to convert column list to comma separated list in Excel?
```
Sub ChangeRange()
'Updateby20140310
Dim rng As Range
Dim InputRng As Range, OutRng As Range
xTitleId = "KutoolsforExcel"
Set InputRng = Application.Selection
Set InputRng = Application.InputBox("Range :", xTitleId, InputRng.Address, Type:=8)
Set OutRng = Application.InputBox("Out put to (single cell):", xTitleId, Type:=8)
outStr = ""
For Each rng In InputRng
If outStr = "" Then
outStr = rng.Value
Else
outStr = outStr & "," & rng.Value
End If
Next
OutRng.Value = outStr
End Sub
```
--https://www.extendoffice.com/documents/excel/1544-excel-convert-column-to-comma-separated-list.html
 
### 2.How to quickly apply formula to an entire column or row with/without dragging in Excel?
here I recommend copy the formula and then select a starting cell and scroll to the last cell you want to apply and hold down shift+select the last cell, paste,
because for excel's nature of infinite scrolling in vertical direction, if you do fill down to apply formula, it may apply to lots of empty cells you don't want to apply to, that will cost high memory usage, and in some case excel may get crashed.
 
https://www.extendoffice.com/documents/excel/867-excel-apply-formula-to-entire-column-row.html
How to remove prefix / suffix from multiple cells in Excel?
https://www.extendoffice.com/documents/excel/2915-excel-remove-prefix-suffix.html
 
### 3.Use AutoSum to sum numbers
https://support.office.com/en-us/article/Use-AutoSum-to-sum-numbers-543941e7-e783-44ef-8317-7d1bb85fe706
 
### 4.Find mismatch value comparing two column
IF(ISERROR(MATCH(E2,$C$2:$C$13363,0)),"na",E2)

### 5.SumIF
https://support.office.com/en-us/article/SUMIF-function-169b8c99-c05c-4483-a712-1697a653039b
 
### 6. Vlookup
https://www.timeatlas.com/vlookup-tutorial/
 
### 7. Match Index
quickly find corresponding values based on comparing the other columns.
=INDEX($F$2:$F$100,MATCH(C2,$E$2:$E$100,0))
http://www.excel-university.com/how-to-return-a-value-left-of-vlookups-lookup-column/
 
### 8.Transpose/convert multi column to single column
https://www.extendoffice.com/documents/excel/1172-excel-transpose-multiple-columns-into-one-column.html
column to table: http://www.cpearson.com/EXCEL/ColumnToTable.aspx
 
### 9.Charts
Scatter Chart - Format Data Label - Label options - select Range
 
SUMIF
How to use SUMIF in Excel - formula examples to conditionally sum cells https://www.ablebits.com/office-addins-blog/2014/11/04/excel-sumif-function-formula-examples/
https://www.techonthenet.com/excel/formulas/sumif.php
https://support.microsoft.com/en-us/help/260415/sumif,-countif-and-countblank-functions-return-value-error
 
### 10. Group and Subtotal
Data-> subtotal
https://www.gcflearnfree.org/print/excel2013/groups-and-subtotals?playlist=Excel_2013
 
### 11. value (long number string or date time) as Text
method 1: import as csv, select the column, change the type to text
method 2: Text()
https://www.extendoffice.com/documents/excel/2476-excel-convert-date-to-text-or-number.html
 
### 12 group by sum
https://www.extendoffice.com/documents/excel/4970-excel-sum-by-group.html
=IF(A2=A1,"",SUMIF(A:A,A2,B:B)), (A2 is the relative cell you want to sum based on, A1 is the column header, A:A is the column you want to sum based on, the B:B is the column you want to sum the values.) Press Enter key, drag fill handle down to the cells to fill the formula.

## problems:
#### to prevent possible loss of data excel cannot shift non-blank cells off of the worksheet
remove the formats
 
#### before copy paste, make sure that you want to copy the function or value only, otherwise excel by default will apply functions if you have to all cells you paste to, that will cost much longer time and more memory
 
#### stop excel converting the value
1). Change the file extension from .csv to .dif
2). Double click on the file to open it in Excel.
3). The 'File Import Wizard' will be launched.
4). Set the 'File type' to 'Delimited' and click on the 'Next' button.
5). Under Delimiters, tick 'Comma' and click on the 'Next' button.
6). Click on each column of your data that is displayed and select a 'Column data format'. The column with the numeric value should be formatted as 'Text'.
7). Click on the finish button, the file will be opened by Excel with the formats that you have specified.
http://stackoverflow.com/questions/137359/excel-csv-number-cell-format

#### whitespace, trim not work ?
 Substitute(A1,char(160),"")
remove stubborn spaces and characters in a cell
https://www.sageintelligence.com/tips-and-tricks/excel-tips-tricks/2014/07/remove-stubborn-spaces-cell/
 
DATA->Text to Columns
 
ref:
https://blogs.office.com/excel/
 
Used Script:
IF(ISERROR(MATCH(E2,$C$2:$C$13363,0)),"na",E2)
=INDEX($f$2:$f$120,MATCH(A2,$e$2:$e$120,0))
INDEX($J$2:$J$239,MATCH(A2,$I$2:$I$239,0))
CONCATENATE("exec somefunction('",A2,"',",(0-F2),",",C2,");")
=LEFT(A3,LEN(A3)-6)