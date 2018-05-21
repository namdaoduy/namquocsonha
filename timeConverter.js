function timeNow() {
	var date = new Date();
	var result;
	YYYY = '' + date.getFullYear();
	MM = '' + (date.getMonth() + 1);
	DD = '' + date.getDate();
	hh = '' + date.getHours();
	mm = '' + date.getMinutes();
	ss = '' + date.getSeconds();
	if (MM.length == 1)
		MM = '0' + MM;
	if (DD.length == 1)
		DD = '0' + DD;
	if (hh.length == 1)
		hh = '0' + hh;
	if (mm.length == 1)
		mm = '0' + mm;
	if (ss.length == 1)
		ss = '0' + ss;
	result = YYYY + '-' + MM + '-' + DD + ' ' + hh + ':' + mm + ':' + ss;
	return result;
}