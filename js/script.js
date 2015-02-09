function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
function dividePoly(dividendObj, dividerObj, divisionID, outputID){
	if(divisionID){
		$("#"+divisionID+" .dividend").html(dividendObj.PolyString.replace(/x(\d+)/g,'x<sup>$1</sup>'));
		$("#"+divisionID+" .divider").html(dividerObj.PolyString.replace(/x(\d+)/g,'x<sup>$1</sup>'));
	}

	var dividend = dividendObj.PolyArray.slice(0);
	var divider = dividerObj.PolyArray.slice(0);
	var left = dividend[0];
	var right = divider[0];
	if(dividend[0] < divider[0]){
		var residualText = dividend.join("</sup>+x<sup>");
		residualText = "x<sup>" + residualText + "</sup>";
		residualText = residualText.replace(/(<sup>1<\/sup>)/g, "");
		residualText = residualText.replace(/(x<sup>0<\/sup>)$/g, "1");

		$("#"+divisionID+" .product").last().html(productText);
		$("#"+divisionID+" table tr").last().after('<tr><td class="residual"></td></tr>');
		$("#"+divisionID+" .residual").last().html(residualText);
	}
	while(dividend[0] >= divider[0]){
			left = dividend[0];
			right = divider[0];
			var quotient = (left-right);
			if(divisionID){
				var quotientText = $("#"+divisionID+" .quotient").html();
				switch(quotient){
					case 0:
						quotientText += '1+';
						break;
					case 1:
						quotientText += 'x+';
						break;
					default:
						quotientText += 'x<sup>'+quotient+'</sup>+';
						break;
				}
				$("#"+divisionID+" .quotient").html(quotientText);
			}

			var productText = '';
			for(var i = 0; i <= divider.length - 1; i++){
				var product = quotient+divider[i];
				switch(product){
					case 0:
						productText += '1+';
						break;
					case 1:
						productText += 'x+';
						break;
					default:
						productText += 'x<sup>'+(product)+'</sup>+';
						break;
				}
				var pos = dividend.indexOf(product);
				if(pos >= 0){
					dividend.splice(pos, 1);
				}else{
					dividend.unshift(product);
				}
			}
			dividend.sort(function(a,b){
				if(a < b){
					return 1;
				}
				if(a > b){
					return -1;
				}
				return 0;
			});
			productText = productText.slice(0, -1);

			var residualText = dividend.join("</sup>+x<sup>");
			residualText = "x<sup>" + residualText + "</sup>";
			residualText = residualText.replace(/(<sup>1<\/sup>)/g, "");
			residualText = residualText.replace(/(x<sup>0<\/sup>)$/g, "1");

			$("#"+divisionID+" .product").last().html(productText);
			$("#"+divisionID+" table tr").last().after('<tr><td class="residual"></td></tr>');
			$("#"+divisionID+" .residual").last().html(residualText);
			if(dividend[0] >= divider[0]){
				$("#"+divisionID+" table tr").last().after('<tr><td class="product"></td></tr>');
			}
		}
		var qFinalText = $("#"+divisionID+" .quotient").html();
		$("#"+divisionID+" .quotient").html(qFinalText.slice(0,-1));
		$("#"+divisionID).removeClass("empty");
		var Rx = $("#"+divisionID+" .residual").last().text();
		return Rx;
}
function parser(string, type, n, k, len){
	len = len || ((n-k)+1);
	var key = string;
	var PolyString;
	var PolyArray;
	var BinaryString;
	var BinaryArray;
	var result = {};
	if(type == 'poly'){
		var splitted = key.split("+");
		splitted.sort(function(a,b){
			if(a.length < b.length){
				return 1;
			}
			if(a.length > b.length){
				return -1;
			}
			if(a[0] < b[0]){
				return 1;
			}
			if(a[0] > b[0]){
				return -1;
			}
			if(a.slice(1) < b.slice(1)){
				return 1;
			}
			if(a.slice(1) > b.slice(1)){
				return -1;
			}
			return 0;
		});
		PolyString = splitted.join("+");
		PolyString = PolyString.replace(/[XхХx]/ig, "x");
		PolyString = PolyString.replace(/(x0)$/, "1");
		result.PolyString = PolyString;

		PolyArray = [];
		BinaryArray = new Array(len);
		var regex = '';
		for (var i = BinaryArray.length - 1; i >= 0; i--) {
			switch(i){
				case 0:
					regex = '((([^x]|^)1)|(x0))$';
					break;
				case 1:
					regex = '(([^0-9]|^)1?x([^0-9]|$))|(x1?([^0-9]|$))';
					break;
				default:
					regex = '(([^0-9]|^)'+i+'x([^0-9]|$))|(x'+i+'([^0-9]|$))';
					break;
			}
			regex = (function(str) {
				return str.replace(/\\/g, "\\$&");
			})(regex);

			BinaryArray[i] = (PolyString.match(new RegExp(regex,'g')))?1:0;

			if(BinaryArray[i] !== 0){
				PolyArray.push(i);
			}
		};
		result.BinaryArray = BinaryArray;
		result.PolyArray = PolyArray;

		BinaryString = BinaryArray.slice(0);
		BinaryString = BinaryString.reverse();
		BinaryString = BinaryString.join("");

		result.BinaryString = BinaryString;

		return result;
	}
	if(type == 'binary'){
		BinaryString = key;
		BinaryArray = BinaryString.split("");
		PolyString = '';
		for (var i = 0; i <= BinaryArray.length - 1; i++) {
			if(BinaryArray[i] == '0'){
				continue;
			}else{
				if(i == BinaryArray.length - 2){
					PolyString += 'x+';
					continue;
				}
				if(i == BinaryArray.length - 1){
					PolyString += '1+';
					continue;
				}
				PolyString += 'x' + (k-i-1)+"+";
			}
		};
		PolyString = PolyString.slice(0, -1);
		len = k;
		return parser(PolyString, 'poly', n, k, len);
	}
}

$(document).ready(function(){
	var resPlaceholder = $("#result").html();
	$("#calc").on("click", function(){
		$("#result").html(resPlaceholder);

		var n = parseInt($("#n").val(), 10);
		var k = parseInt($("#k").val(), 10);
		var G = parser($("#generator").val(), 'poly', n, k);
		var A = parser($("#a").val(), 'binary', n, k);

		$("#input .gp").append(G.PolyString.replace(/x(\d+)/g,'x<sup>$1</sup>'));
		$("#input .gb").append(G.BinaryString);
		$("#input .ap").append(A.PolyString.replace(/x(\d+)/g,'x<sup>$1</sup>'));
		$("#input .ab").append(A.BinaryString);
		// Умножаем Ax на x^(n-k)
		var Ax = '';
		var m = n-k;
		for (var i = 0; i <= A.PolyArray.length - 1; i++) {
			Ax += 'x' + (A.PolyArray[i]+m) + "+";
		};
		Ax = Ax.slice(0, -1);

		var AxNK = parser(Ax, 'poly', n, k, n);

		$("#input .ank").append(AxNK.PolyString.replace(/x(\d+)/g,'x<sup>$1</sup>'));
		$("#input").removeClass("empty");

		// Делим AxNK на Gx
		var Rx = dividePoly(AxNK, G, "division");
		var Vx = AxNK.PolyString.concat("+", Rx);
		var V = parser(Vx, 'poly', n, k, n);

		$.post("coder.php", { word: A.BinaryString }, function(data, status){
			if(status == "success" && data != ""){
				if(V.BinaryString != data){
					alert(data);
				}
				console.log(data);
			}
		});
		$("#output .rp").append(Rx.replace(/x(\d+)/g,'x<sup>$1</sup>'));
		$("#output .vp").append(V.PolyString.replace(/x(\d+)/g,'x<sup>$1</sup>'));
		$("#output .vb").append(V.BinaryString);
		$("#output").removeClass("empty");

		var th = $("#th").val();

		var nth = V.BinaryString[V.BinaryString.length-th];
		var nth = (nth == "1")?"0":"1";

		var S1 = parser("x"+(th-1), 'poly', n, k, n);

		S1 = dividePoly(S1, G, "division_s");
		S1 = parser(S1, "poly", n, k, n-k);

		var Vs = V.BinaryString.slice(0, -th) + nth + ((th > 1) ? (V.BinaryString.slice(-(th-1))) : "");

		Vs = parser(Vs, "binary", n, n, n);
		$("#output_s .V").append(V.BinaryString);
		$("#output_s .Vs").append(Vs.BinaryString);
		$("#output_s .S").append(S1.BinaryString);
		$("#output_s").removeClass("empty");

		var S2 = parser(dividePoly(Vs, G, "division_decode"), "poly", n, k, n-k);

		$("#output_decode .r").append(S2.PolyString);
		$("#output_decode .Sx").append(S2.BinaryString);
		$("#output_decode .S").append(S1.BinaryString);
		$("#output_decode").removeClass("empty");
	});
});