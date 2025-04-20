import { FlatList, Modal, TouchableOpacity, View } from "react-native";
import { Category } from "utils/types";
import { MaterialIcon } from "./MaterialIcon";
import { Typo } from "./Typo";
import { useColorScheme } from "nativewind";
import { getTodoScreenColors } from "utils/colors";
import { useState } from "react";
import { CreateCategoryDialog } from "./CreateCategoryDialog";
import { useTodoStore } from "store/todoStore";




type Props = {
    selectedCategory: Category;
    setSelectedCategory: (category: Category) => void;
    mode: 'create' | 'display'
}

export const CategoryList = ({ selectedCategory, setSelectedCategory, mode }: Props) => {
    // const categories: Category[] = [
    //     // { id: 'all', name: 'All', icon: 'checklist' },
    //     { id: 'work', name: 'Work', icon: 'work' },
    //     { id: 'personal', name: 'Personal', icon: 'person' },
    //     { id: 'shopping', name: 'Shopping', icon: 'shopping-cart' },
    //     { id: 'other', name: 'Other', icon: 'more-horiz' },
    // ];
    const { colorScheme } = useColorScheme()
    const colors = getTodoScreenColors(colorScheme)
    const [isNewCategoryDialogVisible, setIsNewCategoryDialogVisible] = useState<boolean>(false)
    const handleCreateCategory = (name: string, icon: string) => {
        // Handle category creation
        console.log({ name, icon });
    };
    const { category: categories } = useTodoStore()
    return (
        <>
        <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(item) => item.id as string}
            ListHeaderComponent={() => (
                <View className="flex flex-row">
                <TouchableOpacity
                    onPress={() => setIsNewCategoryDialogVisible(true)}
                    className={`mr-2  h-10 flex-row items-center rounded-full px-4`}
                    style={{
                        backgroundColor: colors.categoryBg
                    }}
                    >
                    <MaterialIcon
                      name="add"
                      size={20}
                      color='#f3a49d'
                    />
                  </TouchableOpacity>
                  {mode === 'display' && (
                    <TouchableOpacity
                    onPress={() => setSelectedCategory({ id: 'all', name: 'All', icon: 'checklist' })}
                    className={`mr-2 h-10 flex-row items-center rounded-full px-4`}
                    style={{
                      backgroundColor: selectedCategory.id === 'all' ? colors.categoryActiveTint : colors.categoryBg
                    }}
                    >
                    <MaterialIcon
                      name="checklist"
                      size={20}
                      color={colors.categoryIcon}
                    />
                    <Typo
                      className={`ml-2`}>
                      All
                    </Typo>
                  </TouchableOpacity>
                  )}
                  {mode === 'create' && (
                    <TouchableOpacity
                    onPress={() => setSelectedCategory({id: undefined, name: 'none', icon: 'filter-none'})}
                    className={`mr-2 h-10 flex-row items-center rounded-full px-4`}
                    style={{
                      backgroundColor: selectedCategory.name === 'none' ? colors.categoryActiveTint : colors.categoryBg
                    }}
                    >
                    <MaterialIcon
                      name="filter-none"
                      size={20}
                      color={colors.categoryIcon}
                    />
                    <Typo
                      className={`ml-2`}>
                      None
                    </Typo>
                  </TouchableOpacity>
    )}
                  </View>
            )}
            renderItem={({ item }) => (
                <TouchableOpacity
                    onPress={() => setSelectedCategory(item)}
                    className={`mr-2  h-10 flex-row items-center rounded-full px-4 ${selectedCategory.id === item.id ? 'bg-[#f3a49d]' : ''}`}
                    style={{
                        backgroundColor: selectedCategory.id === item.id ? colors.categoryActiveTint : colors.categoryBg
                      }}
                    >
                    <MaterialIcon
                        name={item.icon}
                        size={20}
                        color={colors.categoryIcon}
                    />
                    <Typo
                        className={`ml-2`}
                        
                        >
                        {item.name}
                    </Typo>
                </TouchableOpacity>
            )}
            // contentContainerStyle={{ paddingHorizontal: 16 }}
            />
            <Modal
            visible={isNewCategoryDialogVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setIsNewCategoryDialogVisible(false)}
        >
          <CreateCategoryDialog
            onClose={() => setIsNewCategoryDialogVisible(false)}
            />
        </Modal>
            </>
    );
};