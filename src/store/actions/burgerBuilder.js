import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const initIngredients = () => {
    return dsipatch => {
        axios.get('https://react-my-burger-fc2ad.firebaseio.com/ingredients.json')
            .then(response => {
                dsipatch(setIngredients(response.data));
            })
            .catch(error => {
                dsipatch(fetchIngredientsFailed());
            });
    }
};

export const setIngredients = (ingredients) => {
    return {
        type: actionTypes.SET_INGREDIENTS,
        ingredients: ingredients
    }
}

export const addIngredient = (name) => {
    return {
        ingredientName: name,
        type: actionTypes.ADD_INGREDIENT
    }
}

export const removeIngredient = (name) => {
    return {
        ingredientName: name,
        type: actionTypes.REMOVE_INGREDIENT
    }
}

export const fetchIngredientsFailed = () => {
    return {
        type: actionTypes.FETCH_INGREDIENTS_FAILED
    }
}
