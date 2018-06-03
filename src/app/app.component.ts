import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  board_row: number = 8;
  board_col: number = 8;
  cellNum: number = 0;
  cellCordinates: Object = {};
  diamond_count: number = 8;
  diamondSet: Object = {};
  winCount: number = 0;
  modalShow: boolean = false;

  ngOnInit() {
  	this.randomGenerators();
    this.initializeBoard();
    }

    initializeBoard() {
    let table = document.createElement("table");
    table.id = "diamond_container";
    for (let i = 0; i < this.board_row; i++) {
        let tr = document.createElement('tr');
        for (let j = 0; j < this.board_col; j++) {
            let td = document.createElement('td');
            let div = document.createElement('div');
            this.cellCordinates[this.cellNum] = {
                x: i,
                y: j
            };
            div.className = "cell unknown";
            div.id = `${this.cellNum}`;
            this.cellNum++;
            td.appendChild(div)
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    document.getElementById("game").appendChild(table);
    document.getElementById("diamond_container").addEventListener("click", this.clickHandler);
}
randomGenerators() {
    while (Object.keys(this.diamondSet).length < this.diamond_count) {
        let randomnumber = Math.ceil(Math.random() * 63)
        this.diamondSet[randomnumber] = randomnumber;
    }
}

reStartGame() {
    this.randomGenerators();
            this.winCount = 0;
            $('div').css('transform', 'none').removeClass('arrow diamond disabled').addClass('unknown');
            }

clickHandler = (e) => {
	console.log("handru");
	
        if (e.target.nodeName == 'DIV') {
            this.winCount++;
            console.log("before")
            if (this.diamondSet[e.target.id]) {
                e.target.className = "cell diamond disabled";
                delete this.diamondSet[e.target.id];
               if (Object.keys(this.diamondSet).length == 0) {
                    $('#winner').modal('show');
                    $('#winScore').empty().text(64 - this.winCount);
                }
               if (Object.keys(this.diamondSet).length == 1) {
                    alert("One more to go, Go and acheive it");
                }
            } else {
                if(Object.keys(this.diamondSet).length == 0) {
                    $('#AlertModel').modal('show');
                } else {
                    var slope = this.hint(e.target.id);
                $('td').removeClass('arrow');
                e.target.className = "cell arrow disabled";
                e.target.style["boxShadow"] = 'none';
                e.target.style["border"] = 'none';
                e.target.style["transform"] = "rotate(" + slope + "deg)";
                }
                
            }
        }
}

minDistance(clicked_id) {
    var distanceMap = {};
    Object.keys(this.diamondSet).map((id) => {
        distanceMap[id] = Math.abs(this.cellCordinates[clicked_id].x - this.cellCordinates[id].x) + 
                          Math.abs(this.cellCordinates[clicked_id].y - this.cellCordinates[id].y);
    });
    let nearestId = Object.keys(distanceMap).sort(function(a, b) {
        return distanceMap[a] - distanceMap[b]
    })
    return nearestId[0];
}

hint(clicked_id) {
    let nearestDiamondId = this.minDistance(clicked_id);
    return (Math.atan2((this.cellCordinates[nearestDiamondId].x - this.cellCordinates[clicked_id].x), (this.cellCordinates[nearestDiamondId].y - this.cellCordinates[clicked_id].y))) * 180 / Math.PI;
}
}
