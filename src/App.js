import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class RecipeBox extends Component {
  constructor(props) {
    super(props);
    this.handleAddRecipe = this.handleAddRecipe.bind(this);
    this.saveRecipeChanges = this.saveRecipeChanges.bind(this);
    this.deleteRecipe = this.deleteRecipe.bind(this);

    this.state = {
      recipes: [{title: 'Test',
                guide: 'test',
                ingredients: 'test'}
                ]}
  }

  handleAddRecipe(e) {
    var recipes = this.state.recipes;
    recipes.push({
      title: '',
      guide: '',
      ingredients: '',
      newRecipe: true
    });
    this.setState(recipes);
  }

  saveRecipeChanges(recipe, index){
    var recipes = this.state.recipes.slice();
    recipes[index] = recipe;
    this.setState({recipes: recipes});
    console.log('recipes: ' +(index));
  }

  deleteRecipe(index) {
    var recipes = this.state.recipes.slice();
    recipes.splice(index, 1);
    this.setState({recipes: recipes});
  }

  render() {
    return(
      <div className="container">
        <RecipeList 
          recipes = {this.state.recipes} 
          editRecipe = {this.saveRecipeChanges} 
          deleteRecipe = {this.deleteRecipe}/>
        <button className="button-theme" onClick={this.handleAddRecipe}> AddRecipe </button>
      </div>
    );
  }
}

class RecipeList extends Component{
  constructor(props) {
    super(props);
    this.fillList = this.fillList.bind(this);
  }

  fillList() {
    var recipeList = [];
    this.props.recipes.forEach((recipe, index, array) => {
      recipeList.push(
        <ListItem 
          recipeData = {recipe} 
          key = {index}
          index= {index}
          editRecipe = {this.props.editRecipe}
          deleteRecipe = {this.props.deleteRecipe}
        />);
    });

    return recipeList;
  }  

  render(){
    return(
        <ul className="recipe-list">
          {this.fillList()}
        </ul>
    );
  }

}

class ListItem extends Component{
  constructor(props) {
    super(props);
    this.createListItem = this.createListItem.bind(this);
    this.titleClicked = this.titleClicked.bind(this);
    this.startEditing = this.startEditing.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.delete = this.delete.bind(this);
    this.state = {state: this.props.recipeData.newRecipe ? 'editing' : 'collapsed'};
    console.log('constuctor');
  }

  titleClicked(e) {
    if(this.state.state === 'editable' || this.state.state === 'expanded'){
      this.setState({state: 'collapsed'});
    } else {
      this.setState({state: 'expanded'});
    }
  }

  startEditing(e) {
    this.setState({state: 'editing'});
  }

  delete(e) {
    this.setState({state: 'collapsed'})
    this.props.deleteRecipe(this.props.index);
  }

  saveChanges() {
    var recipe = {
      title: document.getElementById('title-input').value,
      guide: document.getElementById('guide-textarea').value,
      ingredients: document.getElementById('ingredients-textarea').value
    }
    console.log('save')
    this.setState({state: 'expanded'});
    this.props.editRecipe(recipe, this.props.index);
    
  }

  createListItem(recipeData, key) {
    var listItem;
    console.log('create li');
    if(this.state.state === 'collapsed') {
      listItem = this.createRetractedListItem(recipeData, key);
    } else if(this.state.state === 'expanded') {
      listItem = this.createExpandedListItem(recipeData, key);
    } else if(this.state.state === 'editing') {
      listItem = this.createEditableListItem(recipeData, key);
    }

    return listItem;
  }

  createRetractedListItem(recipeData, key) {
    return (
      <li key = {key} className = "retracted-li" onClick = {this.titleClicked}> 
        {recipeData.title}
      </li>
    )
  }

  createExpandedListItem(recipeData, key) {
    return (
      <li key = {key} className="recipe-li expanded-li">
        <div className="title-bar" onClick = {this.titleClicked}> {recipeData.title} </div>
        <h4> Guide </h4>
        <p> {recipeData.guide}</p>
        <h4> Ingredients </h4>
        <p> {recipeData.ingredients}</p>
        <button onClick = {this.startEditing}>Edit</button>
        <button onClick = {this.delete}>Delete</button>
      </li>
    );
  }

  createEditableListItem(recipeData, key) {
    return(
      <li key = {key} className="recipe-li expanded-li editable-li">
        <input id="title-input" className="title-bar" defaultValue = {recipeData.title}/>
        <h4> Guide </h4>
        <textArea id = "guide-textarea" defaultValue = {recipeData.guide}/>
        <h4> Ingredients </h4>
        <textArea id = "ingredients-textarea" defaultValue = {recipeData.ingredients}/>
        <button onClick = {this.saveChanges}>Finish</button>
      </li>
    );
  }

  render() {
    return(
      this.createListItem(this.props.recipeData, this.props.index)
    );
  }
}

export default RecipeBox;
