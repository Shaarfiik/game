class sketchPad{
    constructor (container, size = 400){// создаём контейнер
        this.canvas = document.createElement("canvas");
        this.canvas.width = size;
        this.canvas.height = size;
        this.canvas.style =`
            background-color: white;
            box-shadow: 0px 0px 10px 2px black;
        `;
        container.apendChild(this.canvas);

        const lineBreak = document.createElement("br");
        container.appendChild(lineBreak);

        this.undoBtn = document.createElement("button");
        this.undoBtn.innerHTML=`UNDO`;
        container.appendChild(this.undoBtn);

        this.ctx = this.canvas.getContext("2d"); // создаём контекст

        this.reset();

        this.#addEventListeners();  //создаёт соыбтие ограниченное только в данном классе
    }

    reset(){
        this.paths=[];
        this.isDrawing=false;
        this.#redraw();
    }

    #addEventListeners(){
        //определение позиции курсора
        this.canvas.onmousedown = (evt) => {
            const mouse = this.#getMouse(evt);
            this.paths.push([mouse]);
            this.isDrawing=true;
        }

        //для начала рисования
        this.canvas.onmousemove = (evt) => { 
            if(this.isDrawing){
                const mouse = this.#getMouse(evt);
                const lastPath = this.paths[this.paths.length-1];
                lastPath.push(mouse);
                this.#redraw();
            }
        }

        //для того чтобы остановить рисование
        document.onmouseup = () => {
            this.isDrawing=false;
        }

        //для получения координат мулититача на мобильных устройствах

        this.canvas.ontouchstart = (evt) => {
            const loc = evt.touches[0]; 
            this.canvas.onmousedown(loc);
        }

        //для начала рисования

        this.canvas.ontouchmove = (evt) => {
            const loc = evt.touches[0];
            this.canvas.onmousemove(loc);
        }

        //для того чтобы остановить рисование

        document.ontouchend = () => {
            document    .onmouseup();
        }

        //отмена нарисованного

        this.undoBtn.onclick = () => {
            this.paths.pop();
            this.#redraw();
        }
    }

    #redraw(){
        this.ctx.clearRect(0,0,
            this.canvas.width,this.canvas.height);
        draw.paths(this.ctx, this.paths);
        if (this.paths.length > 0){
            this.undoBtn.disabled = false;
        }else{
            this.undoBtn.disabled = true;
        }
    }

    #getMouse = (evt) => {
        const rect = this.canvas.getBoundingClientRect(); //с помощью данной функции ограничивает прямоугольник
        return [
            Math.round(evt.clientX-rect.left), //позиция курсора относительно левого верхнего угла по кординате x
            Math.round(evt.clientY-rect.top) //позиция курсора относительно левого верхнего угла по кординате y 
        ];
    }
}
