/**
 * @class Model
 *
 * Manages the data of the application.
 */
class Model {
    constructor() {
      // list of cards that needfs to be shuffled and sorted
        this.numberedCards = [
          {id:1, text:"1", color:"#6F98A8"},
          {id:2, text:"2", color:"#2B8EAD"},
          {id:3, text:"3", color:"#2F454E"},
          {id:4, text:"4", color:"#2B8EAD"},
          {id:5, text:"5", color:"#2F454E"},
          {id:6, text:"6", color:'#BFBFBF'},
          {id:7, text:"7", color:'#BFBFBF'},
          {id:8, text:"8", color:'#6F98A8'},
          {id:9, text:"9", color:"#2F454E"}
        ];
    }
    

    // for binding between model and view
    bindDisplayCards(callback) {
       this.handleDisplayCards = callback
    }

    _commit(numberedCards) {
      this.handleDisplayCards(numberedCards)
    }

    // function to append the numbered cards to random order
    shuffleCards(cardList) {
      for (var i = cardList.length - 1; i > 0; i--) {
        // Generate random number
        var j = Math.floor(Math.random() * (i + 1));          
        var temp = cardList[i];
        cardList[i] = cardList[j];
        cardList[j] = temp;
      }
      this.numberedCards = cardList
      this._commit(this.numberedCards)
    }

    // function to sort the numbered cards in ascending order
    sortCards(cardList){
      cardList.sort((a, b) => {
        return a.id - b.id;
      });
      this.numberedCards = cardList
      this._commit(this.numberedCards)
    }


  }

/**
 * @class View
 *
 * Visual representation of the model.
 */
  class View {
    constructor() {
      // The root element
      this.app = this.getElement('#root')

      // The visual representation of the todo list
      this.numberCardList = this.createElement('ul', 'numbderCard-list')

      this.actionButton = this.createElement('div','action-btns')
      this.numberedCardBlock = this.createElement('div','numbercard-block')
      this.shuffletButton = this.createElement('button','shuffle-btn')
      this.shuffletButton.textContent = 'Shuffle'

      this.sortButton = this.createElement('button','sort-btn')
      this.sortButton.textContent = 'Sort'

      this.numberedCardBlock.append(this.numberCardList)
      this.actionButton.append(this.shuffletButton,this.sortButton)

      // Append the card list, sort and shuffle button to the app
      this.app.append(this.numberedCardBlock,this.actionButton)

      this._temporaryCardsList = ''

    }

    // Create an element with an optional CSS class
    createElement(tag, className) {
      const element = document.createElement(tag)
      if (className) element.classList.add(className)
      return element
    }

    // Retrieve an element from the DOM
    getElement(selector) {
      const element = document.querySelector(selector)
      return element
    }

    // to display the numbercards on screen
    displayCards(cards){

      cards.forEach((card,index) => {
        const li = this.createElement('li')
        li.id = card.id
        li.style.background  = card.color
        li.style.borderColor = card.color
        li.textContent = card.text
        if(this.numberCardList.children[index]){
          this.numberCardList.replaceChild(li, this.numberCardList.children[index]);
        }else{
          this.numberCardList.appendChild(li);
      }
      })
      this._temporaryCardsList = cards
    }

    // to handle the event of shuffle btn click
    bindShuffleCards(handler) {
      this.actionButton.addEventListener('click', event => {
        event.preventDefault()
        if(event.target.className == 'shuffle-btn'){
          handler(this._temporaryCardsList)
        }
      })
    }

    // to handle the event of sort btn click
    bindSortCards(handler) {
      this.actionButton.addEventListener('click', event => {
        event.preventDefault()
        if(event.target.className == 'sort-btn'){
          handler(this._temporaryCardsList)
        }
      })
    }


  }
  
/**
 * @class Controller
 *
 * Links the user input and the view output.
 *
 * @param model
 * @param view
 */
  class Controller {
    constructor(model, view) {
      this.model = model
      this.view = view
      
      // Display initial numbered cards list
      this.handleDisplayCards(this.model.numberedCards)
      this.model.bindDisplayCards(this.handleDisplayCards)
      this.view.bindShuffleCards(this.handleShuffleCall)
      this.view.bindSortCards(this.handleSortCall)

    }

    handleDisplayCards = cards => {
      this.view.displayCards(cards)
    }

    handleShuffleCall = cards => {
      this.model.shuffleCards(cards)
    }

    handleSortCall = cards => {
      this.model.sortCards(cards)
    }
  }
  
  const app = new Controller(new Model(), new View())