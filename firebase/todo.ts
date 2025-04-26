import { Todo } from "utils/types";
import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"

export const createFirebaseTodo = async (todo: Todo) => {
    try {
        const user = auth().currentUser;
        if(!todo){
            console.log('Todo not found');
            return false;
        }
        if (!user) {
            console.log('User not authenticated');
            return false;
        }
        const validTodo = Object.fromEntries(
            Object.entries(todo).filter(([_, value]) => value !== undefined)
        );

        if (!validTodo.id) {
            console.log('Todo ID is required');
            return false;
        }

        await firestore()
            .collection('users')
            .doc(user.uid)
            .collection('todos')
            .doc(todo.id)
            .set(validTodo);
        return true;
    } catch (error) {
        console.log('Error creating todo:', error);
        return false;
    }
}

export const deleteFirebaseTodo = async (todoId: string) => {
    try {
        const user = auth().currentUser;
        if(!todoId){
            console.log('Todo not found');
            return false;
        }
        if (!user) {
            console.log('User not authenticated');
            return false;
        }
        await firestore()
            .collection('users')
            .doc(user.uid)
            .collection('todos')
            .doc(todoId)
            .delete();
        return true;
    } catch (error) {
        console.log('Error deleting todo:', error);
        return false;
    }
}

export const updateFirebaseTodo = async (todo: Todo) => {
    try {
        console.log(todo)
        const user = auth().currentUser;
        if(!todo){
            console.log('Todo not found');
            return false;
        }
        if (!user) {
            console.log('User not authenticated');
            return false;
        }
        const validTodo = Object.fromEntries(
            Object.entries(todo).filter(([_, value]) => value !== undefined)
        );
        console.log(validTodo)

        if (!validTodo.id) {
            console.log('Todo ID is required');
            return false;
        }

        await firestore()
            .collection('users')
            .doc(user.uid)
            .collection('todos')
            .doc(todo.id)
            .set(validTodo);
        return true;
    } catch (error) {
        console.log('Error updating todo:', error);
        return false;
    }
}

