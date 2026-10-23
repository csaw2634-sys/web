 let num = 0; 
        let num_in = document.getElementById('count');
        // 증가하는 함수
        function increase(){
            num ++
            num_in.innerText = num ; 
        };

        // 감소하는 함수
        function decrease(){
          // 0까지만 작동하게 하는 법
          if(num>0){
            num --}
            num_in.innerText =num; 
        };

        // 초기화하는 함수
         function reset(){
            num = 0
            num_in.innerText = num ; 
        };
