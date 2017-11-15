import React, { Component } from 'react';
import './App.css';
import { getGraphemes, getWords } from './Parser';

function preloadSounds(filenames) {
  filenames.forEach(f => {
    const a = new Audio(`sounds/${f}.mp3`);
  });
}

function playSound(filename) {
  return new Promise((resolve, reject) => {
    const a = new Audio(`sounds/${filename}.mp3`);
    a.play();
    a.addEventListener('ended', () => resolve());
    a.addEventListener('error', (err) => reject(err));
  });
}

function RandomWordButton(props) {
  return <button className="btn btn-primary btn-lg" onClick={props.onClick}>Random</button>
}

function WordRevealer(props) {
  return <button className="btn btn-primary btn-lg">Reveal</button>
}

class DroppableGrapheme extends Component {
  onDrop(e) {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text'));
    console.log('droped', data);
  }

  render() {
    const representation = this.props.grapheme.isFound && this.props.grapheme.representation;
    return (
      <div
       className={`col-md-1 base droppable cursive ${this.props.grapheme.graphemeType}`}
       onDrop={this.onDrop}
       onDragEnd={this.onDrop}>
        {representation}
      </div>
      );
  }
}

function WordPanel(props) {
  return (
    <div>
      {props.word.graphemes.map(g => {
        return <DroppableGrapheme key={g.reprensentation} grapheme={g} />
      })}
    </div>
  );
}

function WordImg(props) {
  return <img className="word-img thumbnail" alt="mot à trouver" src={`images/${props.fileName}.jpg`} />;
}

function WordRow(props) {
  return (
    <div className="row word">
      <div className="col-md-2">
        <WordImg fileName={props.word.fileName} />
      </div>
      <WordPanel word={props.word} />
      <div className="base col-md-1 navbar-right sol">
        <div className="row">
          <WordRevealer word={props.word} />
        </div>
        <div className="row">
          <RandomWordButton onClick={props.onRandomClick} />
        </div>
      </div>
    </div>
  );
}

class DraggableGrapheme extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSoundIndex: 0,
    }
  }

  onMouseDown() {
    playSound(`phonems/${this.props.grapheme.representation}`);
  }

  onDragStart(e) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text', JSON.stringify(this.props.grapheme));
  }

  onDragEnd(e) {
    e.preventDefault();
  }

  render() {
    const soundClass = this.props.grapheme.phonems.length > 1 ? `sound-${this.state.currentSoundIndex}` : '';
    return (
      <div
       draggable="true"
       className={`col-md-1 base draggable cursive
        ${this.props.grapheme.graphemeType} ${soundClass}`}
       onMouseDown={() => this.onMouseDown()}
       onDragStart={(e) => this.onDragStart(e)}
       onDragEnd={(e) => this.onDragEnd(e)}>
        {this.props.grapheme.representation}
      </div>
    );
  }
}

function GraphemePanelSwitch(props) {
  return (
    <button onClick={props.onClick} className="btn btn-primary btn-lg ">
      <span className="glyphicon glyphicon-arrow-right" />
    </button>
  );
}

class GraphemeBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentGraphemeType: 'simple',
    }
  }

  onGraphemePanelSwitch() {
    this.setState(prevState => ({
      currentGraphemeType: prevState.currentGraphemeType === 'simple' ? 'complex' : 'simple'
    }))
  }

  render() {
    const graphemesToDisplay = this.state.currentGraphemeType === 'simple' ? this.props.graphemes : this.props.complexes;
    return (
      <div className="row letters">
        {graphemesToDisplay.map(g => {
          return <DraggableGrapheme key={g.reprensentation} grapheme={g} />
        })}
        <div className="col-md-1 base">
          <GraphemePanelSwitch onClick={() => this.onGraphemePanelSwitch()} />
        </div>
      </div>
      )
  }
}

class Dictation extends Component {
  constructor(props) {
    super(props);
    this.words = getWords();
    this.graphemes = getGraphemes();
    this.state = {
      currentWord: this.words[this.getRandomWordIndex()],
    };

    const phonems = [...this.graphemes.vowels, ...this.graphemes.consonants, ...this.graphemes.complexes];
    preloadSounds(this.words.map(w => w.fileName))
    preloadSounds(phonems.map(p => `phonems/${p.representation}`));
  }

  getRandomWordIndex() {
    return Math.floor(Math.random() * (this.words.length));
  }

  setRandomCurrentWord() {
    const currentWord = this.words[this.getRandomWordIndex()];
    this.setState({
      currentWord: currentWord,
    });
    playSound(`words/${currentWord.fileName}`);
  }

  render() {
    return (
      <div className="container">
        <WordRow word={this.state.currentWord} onRandomClick={() => this.setRandomCurrentWord()}/>
        <GraphemeBoard
          graphemes={[...this.graphemes.vowels, ...this.graphemes.consonants]}
          complexes={this.graphemes.complexes}
        />
      </div>
    );
  }
}

export default Dictation;
