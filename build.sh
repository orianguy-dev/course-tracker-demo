cd /home/claude/demo2 && { cat part1.html; echo '<script>'; cat emblems.js; echo 'window.EMB=EMB;'; cat part2.js part3.js part4.js part5.js part6.js; echo 'CT.init();</script>'; } > index.html
