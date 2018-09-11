//BUDGET CONTROLLER
var budgetcontroller = (function(){
    
    var Expense = function(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
      this.percentage = -1;
    };
    
    Expense.prototype.calcPercentage = function(totalIncome){
      
      if (totalIncome >0){
        this.percentage = Math.round((this.value/totalIncome) *100);
      }else{
          this.percentage =-1;
      }
        
    };
    
    Expense.prototype.getPercentages = function() {
        return this.percentage;
        
    }
      
    var Income = function(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
  };
    
    var calculateTotal = function(type){
        var sum = 0;
        data.allItem[type].forEach(function(cur){
          sum += cur.value;
            
        });
        data.totals[type] = sum;
    };
    
    var data = {
        allItem: {
            expense: [],
            income: []
        },
        totals: {
            expense: 0,
            income: 0
        },
        budget : 0,
        persentage : -1
    };
    
    return{
        addItem: function(type, des, val){
            var newItem;
            
            //Create new id 
            if (data.allItem[type].length>0 ){
            ID = data.allItem[type][data.allItem[type].length - 1].id + 1;
            } else {
                ID =0;
            }
            //Create new item based on 'inc' or 'exp type
            if (type === 'expense') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'income'){
                newItem = new Expense(ID, des, val);
            }
            
            // Push it into our data structure
            data.allItem[type].push(newItem);
            
            // Return the new element
            return newItem;
      
        },
        
        deleteItem: function(type, id){
            var ids, index;
          
            ids = data.allItem[type].map(function(current){
               return current.id; 
            });
            
                index = ids.indexOf(id);
                
                if (index !== -1){
                    data.allItem[type].splice(index, 1);
                }
                
           
            
        },
        
        calculateBudget: function(){
          
            //calculate totla income and expenses
            calculateTotal('expense');
            calculateTotal('income');
            
            //Claculate the budget: income - expenses
            data.budget = data.totals.income-data.totals.expense;
            
            
            //calculate the percentage of income that we spent
            if (data.totals.income >0){
            data.persentage = Math.round((data.totals.expense / data.totals.income) * 100);
            }else{
                data.persentage = -1;
            }
            
        },
        
        calculatePercentages: function(){
          
            data.allItem.expense.forEach(function(cur){
                
               cur.calcPercentage(data.totals.income);
                
            });
            
        },
        
        getPrecentages: function(){
            
            var allPerc = data.allItem.expense.map(function(cur){
                 return cur.getPercentages();
                
            });
            return allPerc;
        },
        
        getBudget: function() {
          return {
              budget: data.budget,
              totalInc: data.totals.income,
              totalExp: data.totals.expense,
              percentage: data.persentage
          };
            
        },
          testing: function(){
            console.log(data);
        }
    };
    
})();



//UI CONTROLLER
var UIController = (function(){
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDscription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercenLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
        
    };
    
        var formatNumber = function(num, type) {
          var numSplit, int, dec, type;

          num = Math.abs(num);
          num = num.toFixed(2);
    
          numSplit = num.split('.');
    
          int = numSplit[0];
          if (int.length > 3) {
              int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
          }
    
          dec = numSplit[1];
            
          return (type === 'expense' ? '-' : '+') + ' ' + int + '.' + dec;
              
   

        };
    
        var nodeListForEach = function (list, callback){
              for (var i =0; i< list.length; i++){
                  callback(list[i], i);
              }
                
        };
    
    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value, //Will be either inc or exp
                description: document.querySelector(DOMstrings.inputDscription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value) };
                    },
        
        
        addListItem: function(obj, type){
            var html, newHTML, element;
            // Ceate html string with placeholder text.
            
            if (type === 'income'){ 
             element = DOMstrings.incomeContainer;
                
             html = '<div class="item clearfix" id="income-%id%"> <div class="item__description"> %description% </div> <div class="right clearfix"> <div class="item__value">%value% </div> <div class="item__delete">  <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'; 
            
            }else if (type === 'expense'){
            element = DOMstrings.expensesContainer;
                
            html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description"> %description% </div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
            }
            
            // replace the place holder text with some actual data
            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', formatNumber(obj.value , type));
        
            
        
            // Insert the html into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
            
        },
        
        deleteListItem: function(selctorID){
            
            var element = document.getElementById(selctorID);
            element.parentNode.removeChild(element);
            
        },
        
        
        
        clearFIelds: function() {
            var fields, fieldsArray;
            fields = document.querySelectorAll(DOMstrings.inputDscription + ', ' + DOMstrings.inputValue)
            
            fieldsArray = Array.prototype.slice.call(fields);
            
            fieldsArray.forEach(function(current, index, array) {
                current.value = "";
            }); 
            
            fieldsArray[0].focus();
        },
        
        displayBudget: function(obj){
            var type;
            
            obj.budget > 0 ? type = 'income' : type = 'expense';
            
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'income');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'expense');
            
            if (obj.percentage >0){
              document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
              document.querySelector(DOMstrings.percentageLabel).textContent = '---';

            }
            
        },
        
        displayPercentages: function(percentages){
            
            var fields = document.querySelectorAll(DOMstrings.expensesPercenLabel);
            
            
            nodeListForEach(fields, function(current, index){
                
                if (percentages[index] > 0 ){
                   current.textContent = percentages[index] +'%';     
                }else{
                    current.textContent = '---';  
                }
               
                
            });
            
        },
        
        displayMonth: function(){
            var now, year, month, day;
            
            now = new Date();
            
            months = ['January', 'February', 'March', 'April', 'May' , 'June,' , 'July' , 'August', 'September', 'October', 'November', 'December' ]
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month-1] + ' ' + year;
            
            
        },
        
        changeType: function() {
    
            
           var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDscription + ',' +
                DOMstrings.inputValue);
            
            nodeListForEach(fields, function(cur) {
               cur.classList.toggle('red-focus');
                
            });
            
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
            
            
        },
        
     
        getDOMstrings: function(){
            return DOMstrings;
        }
    }
    
})();





//GLOBAL APP CONTROLER
var controller =(function(bugetCtrl, UICtrl){
    
    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
    
        document.addEventListener('keypress', function(event) {
        if (event.keyCode === 13 || event.which === 13){
            ctrlAddItem();
        }
    });
      
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);
        
    };
    
    var updateBudget = function(){
                
        //1. Calculate the budget
        bugetCtrl.calculateBudget();
        
        //2.Return the budget
        var budget = bugetCtrl.getBudget();
        
        //3. Display the budget on the UI
        UICtrl.displayBudget(budget);
        
        //4. Calculate and update percentages
        updatePercentages();
        
    };
    
    
    var updatePercentages = function(){
        
        // 1. Calculate percentage
        bugetCtrl.calculatePercentages();
        
        // 2. Read percentage from the budget controler
        var precentages = bugetCtrl.getPrecentages();
        
        
        
        // 3. Update the UI with the new percentages
        UICtrl.displayPercentages(precentages);
    }
    
    
    
    var ctrlAddItem = function() {
        var input, newitem;
        
        // 1. Get the field input data
        input = UICtrl.getInput();
        
        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
   
            //2. Add the item to the budget controller
            newitem = bugetCtrl.addItem(input.type, input.description, input.value);
            
            //3. Add the itme to the UI
            UICtrl.addListItem(newitem, input.type);
            
            //4.Clear the fields
            UICtrl.clearFIelds();
            
            //5.Calculate and update the budget
            updateBudget();
            
            //6.  Calculate and update percentages
            updatePercentages();
            
       }
   
     };
    
    var ctrlDeleteItem = function(event){
        var itemID, splitId, type, ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; 
        
        if (itemID){
            
            splitId = itemID.split('-');
            type = splitId[0];
            ID = parseInt(splitId[1]);
            
            //1. Dealte the item from the data structure
            bugetCtrl.deleteItem(type, ID);
            
            //2. Dealte the item from the UI
            UICtrl.deleteListItem(itemID);
            //3. update and show the new budget
            updateBudget();
        }
        
    };

    return {
        init: function() {
            console.log('Application has statrted');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
              totalInc: 0,
              totalExp: 0,
              percentage: -1
            });
            setupEventListeners();
        }
        
      
    };
    
    
})(budgetcontroller,UIController );

controller.init();