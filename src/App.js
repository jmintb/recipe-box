import React, { Component } from 'react';
import './App.css';

class RecipeBox extends Component {
  constructor(props) {
    super(props);
    this.addRecipe = this.addRecipe.bind(this);
    this.saveRecipeChanges = this.saveRecipeChanges.bind(this);
    this.deleteRecipe = this.deleteRecipe.bind(this);
    this.loadRecipes = this.loadRecipes.bind(this);
    this.loadRecipes();
  }

  loadRecipes() {
    var recipes = localStorage.getItem('recipes');
    if(recipes !== null){
      recipes = JSON.parse(recipes);
    } else {
      recipes = [];
    }

    this.state = {recipes: recipes};
  }

  addRecipe(e) {
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
    recipes[index].title = recipe.title;
    recipes[index].guide = recipe.guide;
    recipes[index].ingredients = recipe.ingredients;
    delete(recipes[index].newRecipe);
    this.setState({recipes: recipes});
    localStorage.setItem('recipes', JSON.stringify(this.state.recipes));
  }

  deleteRecipe(index) {
    var recipes = this.state.recipes.slice();
    recipes.splice(index, 1);
    this.setState({recipes: recipes});
    localStorage.setItem('recipes', JSON.stringify(recipes));
  }

  render() {
    return(
      <div className="container">
        <RecipeList
          recipes = {this.state.recipes}
          editRecipe = {this.saveRecipeChanges}
          deleteRecipe = {this.deleteRecipe}
        />
        <button className="button-theme add-btn" onClick={this.addRecipe}> AddRecipe </button>
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
    this.setState({state: 'collapsed'});
    this.props.editRecipe(recipe, this.props.index);    
  }

  createListItem(recipeData, key) {
    var listItem;
    if(this.state.state === 'collapsed') {
      listItem = this.createRetractedListItem(recipeData, key);
    } else if(this.state.state === 'expanded') {
      listItem = this.createExpandedListItem(recipeData, key);
    } else if(this.state.state === 'editing') {
      listItem = this.createEditableListItem(recipeData, key);
    }
    return listItem;
  }

   getRecipeTitle(title){
    return title === '' ? 'Unknown' : title;
  }

  createRetractedListItem(recipeData, key) {
    return (
      <li key = {key} className = " recipe-li title-bar" onClick = {this.titleClicked}> 
        {this.getRecipeTitle(recipeData.title)}
      </li>
    )
  }

  createExpandedListItem(recipeData, key) {
    return (
      <li key = {key}>
        <div className="title-bar" onClick = {this.titleClicked}> {this.getRecipeTitle(recipeData.title)} </div>
        <div className = "recipe-li expanded-li">
        <h4> Guide </h4>
        <pre>{recipeData.guide}</pre>
        <h4> Ingredients </h4>
        <pre>{recipeData.ingredients}</pre>
        <button className="button-theme" onClick = {this.startEditing}>Edit</button>
        <button className="button-theme delete-btn" onClick = {this.delete}>Delete</button>
        </div>
      </li>
    );
  }

  createEditableListItem(recipeData, key) {
    return(
      <li key = {key}>
        <input id="title-input" className="title-bar" placeholder="Name" defaultValue = {recipeData.title}/>
        <div className="recipe-li expanded-li">
        <h4> Guide </h4>
        <textArea id = "guide-textarea" placholder="Write what to do..." defaultValue = {recipeData.guide}/>
        <h4> Ingredients </h4>
        <textArea id = "ingredients-textarea" placholder="Write to use..." defaultValue = {recipeData.ingredients}/>
        <br/>
        <button className="button-theme" onClick = {this.saveChanges}>Finish</button>
        </div>
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
