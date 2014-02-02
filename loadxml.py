from bottle import *

@route('/')
def index():
	return template('index.html')

@route('/loadxml')
def loadxml():
	return template('loadxml.html')

@route('/s/js/<fname>')
def loadjs(fname):
	return static_file(fname,'./s/js')

@route('/s/css/<fname>')
def loadcss(fname):
	return static_file(fname,'./s/css')

@route('/Flat-UI-master/bootstrap/css/<fname>')
def loadbootstrapcss(fname):
	return static_file(fname,'./Flat-UI-master/bootstrap/css')

@route('/Flat-UI-master/css/<fname>')
def loaduicss(fname):
	return static_file(fname,'./Flat-UI-master/css')
@route('/Flat-UI-master/js/<fname>')
def loaduijs(fname):
	return static_file(fname,'./Flat-UI-master/js')

@route('/s/<fname>')
def loadbook(fname):
	return static_file(fname,'./s')

run(host='localhost', port=8089, debug=True)
