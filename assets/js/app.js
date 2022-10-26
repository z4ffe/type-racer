import words from '../data/words.js'
import elements from './elements.js'

class WPMGame {
   afterGameArr = [];
   currentWords;
   right = 0;
   wrong = 0;
   keyPressed = 0;

   constructor(words, el, firstWord, timer, timeout) {
	  this.words = words
	  this.el = el
	  this.firstWord = firstWord
	  this.timer = timer
	  this.timeout = timeout
   }

   reset() {
	  window.removeEventListener('keyup', this.#highlightWords)
	  window.removeEventListener('keydown', this.#nextWord)
	  clearInterval(this.timer)
	  clearTimeout(this.timeout)
	  this.el.userInput.disabled = true
	  this.el.userInput.placeholder = 'PRESS START'
	  this.el.timer.innerHTML = `1<span>:</span>00`
	  this.el.wordsWindow.innerHTML = null
	  this.el.userInput.value = null
	  this.afterGameArr = []
	  this.right = 0;
	  this.wrong = 0;
	  this.keyPressed = 0;
	  this.el.startBtn.addEventListener('click', () => this.start(), {once: true})
   }

   #modalResult() {
	  this.el.modalWpm.textContent = `${this.right}`
	  this.el.modalAcc.textContent = `${Math.round(+this.afterGameArr.join('').length / this.keyPressed * 100)}%`
	  this.el.modalTotal.textContent = `${this.right + this.wrong}`
	  this.el.modalWrong.textContent = `${this.wrong}`
	  this.el.modalWrapper.classList.toggle('modal-visible')
	  this.el.modal.classList.toggle('modal-visible')
   }

   #timer() {
	  let initialTimer = 59;
	  this.timer = setInterval(() => {
		 if (initialTimer < 10) this.el.timer.innerHTML = `0<span class="dots">:</span>0${initialTimer--}`
		 else this.el.timer.innerHTML = `0<span class="dots">:</span>${initialTimer--}`
	  }, 1000)
	  this.timeout = setTimeout(() => {
		 clearInterval(this.timer)
		 this.el.timer.innerHTML = `1<span class="dots">:</span>00`
		 this.#modalResult()
		 this.reset()
	  }, 60500)
   }

   #render() {
	  this.el.wordsWindow.innerHTML = ''
	  this.currentWords.forEach((word, idx) => {
		 if (!idx) this.el.wordsWindow.innerHTML += `<span class="first__word">${word}<span> `
		 else this.el.wordsWindow.innerHTML += `${word} `
	  })
	  this.firstWord = document.querySelector('.first__word')
   }

   clearInput() {
	  this.el.userInput.value = null
   }

   checkWord() {
	  this.el.userInput.value.trim() === this.currentWords[0] ? this.right++ : this.wrong++
	  this.afterGameArr.push(this.currentWords.shift())
	  this.#render()
	  this.el.userInput.value = ''
   }

   #nextWord = (e) => {
	  this.el.userInput.maxLength = this.currentWords[0].length + 1
	  if (e.code === 'Space' && this.el.userInput.value) this.checkWord()
	  if (e.code !== 'Backspace' && e.code !== 'Space') this.keyPressed++
   }

   #highlightWords = () => {
	  if (!this.el.userInput.value.trim()) return this.firstWord.className = ''
	  if (!this.currentWords[0].includes(this.el.userInput.value.trim())) {
		 this.firstWord.classList.add('wrong')
		 this.firstWord.classList.remove('right')
	  } else {
		 this.firstWord.classList.add('right')
		 this.firstWord.classList.remove('wrong')
	  }
   }

   start() {
	  this.el.userInput.disabled = false
	  this.el.userInput.placeholder = 'START TYPING'
	  this.currentWords = this.words.sort(() => Math.random() - 0.5)
	  this.el.userInput.focus()
	  this.clearInput()
	  this.#render()
	  this.#timer()
	  window.addEventListener('keydown', this.#nextWord)
	  window.addEventListener('keyup', this.#highlightWords)
   }

   #listeners() {
	  this.el.startBtn.addEventListener('click', () => this.start(), {once: true})
	  this.el.resetBtn.onclick = () => this.reset()
	  this.el.closeModal.onclick = e => this.#modalResult()
	  this.el.modalWrapper.onclick = e => e.target.classList.contains('modal-visible') ? this.#modalResult() : null
   }

   app() {
	  this.#listeners()
   }
}

let wpmGames = new WPMGame()
wpmGames.words = words
wpmGames.el = elements


window.onload = () => wpmGames.app()
