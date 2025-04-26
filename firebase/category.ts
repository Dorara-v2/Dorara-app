import { Category } from 'utils/types';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const createFirebaseCategory = async (category: Category) => {
  try {
    const user = auth().currentUser;
    if(!category){
        console.log('Category not found');
        return false;
    }
    if (!user) {
      console.log('User not authenticated');
      return false;
    }
    await firestore()
      .collection('users')
      .doc(user.uid)
      .collection('categories')
      .doc(category.id)
      .set(category);
    return true;
  } catch (error) {
    console.log('Error creating category:', error);
    return false;
  }
};

export const deleteFirebaseCategory = async (categoryId: string) => {
    try {
        const user = auth().currentUser;
        if(!categoryId){
            console.log('Category not found');
            return false
        }
        if (!user) {
            console.log('User not authenticated');
            return false;
        }
        await firestore()
            .collection('users')
            .doc(user.uid)
            .collection('categories')
            .doc(categoryId)
            .delete();
        return true
    } catch (error) {
        console.log('Error deleting category:', error);
        return false
    }
};


export const updateFirebaseCategory = async (category: Category) => {
    try {
        const user = auth().currentUser;
        if(!category){
            console.log('Category not found');
            return
        }
        if (!user) {
            console.log('User not authenticated');
            return;
        }
        if (!category.id) {
            console.log('Category ID is undefined');
            return;
        }
        await firestore()
            .collection('users')
            .doc(user.uid)
            .collection('categories')
            .doc(category.id)
            .update(category);
        return true;
    } catch (error) {
        console.log('Error updating category:', error);
        return false
    }
};