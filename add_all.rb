PARTS = <<-PARTS
@import '1001_frameN';
@import '1002_frame2colD';
@import '1003_frame3colD';
@import '1004_frame4col';
@import '1005_frame5col';
@import '1006_frame6col';
@import '1007_frame7col';
PARTS

old_file = File.open("./devStuff/src/parts/_all.scss").read
File.open("./devStuff/src/parts/_all.scss", "w").puts("#{old_file.chomp.chomp}\n#{PARTS}")