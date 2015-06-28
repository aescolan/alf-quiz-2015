//GET /creditos/autor
exports.autor = function(req,res) {
	res.render('creditos/autor',{nombre: 'Alfonso Escolano'});
};
