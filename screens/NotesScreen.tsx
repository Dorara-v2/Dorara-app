import { FolderItem } from "components/FolderItem";
import ScreenContent from "components/ScreenContent";
import { Typo } from "components/Typo";
import { useColorScheme } from "nativewind";
import { useEffect, useMemo, useState } from "react";
import { Animated, FlatList, Text, TouchableOpacity, View, ActivityIndicator, Alert, Image } from "react-native";
import { createFile } from "utils/offlineDirectory/createFiles";
import { fetchFolders } from "utils/offlineDirectory/fetchFolders";
import { CreateDialog } from "components/CreateDialog";
import { createFolder } from "utils/offlineDirectory/createFolder";
import { useLoadingStore } from "store/loadingStore";
import { MaterialIcon } from "components/MaterialIcon";
import { NothingHere } from "components/NothingHere";
export default function NotesScreen() {
    const { setContent, setLoading } = useLoadingStore();
    const { colorScheme } = useColorScheme();
    const [currentDirectory, setCurrentDirectory] = useState("");
    const [directoryArray, setDirectoryArray] = useState<string[]>([""]);
    const [folders, setFolders] = useState<{ name: string; isDirectory: boolean }[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuAnimation = useState(new Animated.Value(0))[0];
    const [dialogVisible, setDialogVisible] = useState(false);
    const [createType, setCreateType] = useState<"file" | "folder">("folder");
    const [isLoading, setIsLoading] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        visible: false,
        title: '',
        message: '',
        type: 'success' as const
    });

    const relativePath = useMemo(() => {
        return currentDirectory === "" ? "" : `${directoryArray.filter(Boolean).join("/")}`;
    }
    , [currentDirectory, directoryArray]);

    const sortedFolders = useMemo(() => {
        return [...folders].sort((a, b) => {
            if (a.isDirectory && !b.isDirectory) return -1;
            if (!a.isDirectory && b.isDirectory) return 1;
            return a.name.localeCompare(b.name);
        });
    }, [folders]);

    const toggleMenu = () => {
        const toValue = isMenuOpen ? 0 : 1;
        Animated.spring(menuAnimation, {
            toValue,
            useNativeDriver: true,
        }).start();
        setIsMenuOpen(!isMenuOpen);
    };

    const handleBack = () => {
        if (directoryArray.length <= 1) return;

        const newArray = directoryArray.slice(0, -1);
        const previousDirectory = newArray[newArray.length - 1] || "";

        setDirectoryArray(newArray);
        setCurrentDirectory(previousDirectory);
    };

    const loadFolders = async () => {
        try {
            setContent("Loading folders...");
            setLoading(true);
            // const relativePath = currentDirectory === "" ? "" : `${directoryArray.filter(Boolean).join("/")}`;
            const folders = await fetchFolders(relativePath);
            setFolders(folders);
        } catch (error) {
            console.error("Error fetching folders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFolders();
    }, [currentDirectory]);

    const handleCreate = (name: string) => {
        if (createType === "folder") {
            createFolder(`${relativePath}/${name}`).then((success) => {
                if(!success) Alert.alert("Folder already exists", "Please choose a different name", [{}]);
                loadFolders();
            });
        } else {
            createFile(`${name}.md`, relativePath).then((success) => {
                if(!success) Alert.alert("File already exists", "Please choose a different name");
                loadFolders();
            });
        }
    };

    return (
        <ScreenContent>
            <View className="flex flex-row items-center justify-start p-4">
                <TouchableOpacity onPress={handleBack} disabled={directoryArray.length <= 1}>
                    {currentDirectory !== "" && (
                        <Typo>
                            <MaterialIcon name="arrow-back" size={30} />
                        </Typo>
                    )}
                </TouchableOpacity>
                <Typo className="text-2xl font-semibold ml-4">
                    {currentDirectory === "" ? "Notes" : relativePath}
                </Typo>
            </View>
            <FlatList
                data={sortedFolders}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                    <>
                    {!isLoading && <FolderItem
                        loadFolders={loadFolders}
                        file={item}
                        setCurrentDirectory={setCurrentDirectory}
                        setDirectoryArray={setDirectoryArray}
                        currentPath={relativePath}
                    />}
                    {isLoading && <View style={{ height: 'auto', width: 'auto', backgroundColor: colorScheme === "dark" ? "#1f1f1f" : "white" }}>
                        
                    </View>}
                    </>
                )}
                ListEmptyComponent={
                    isLoading ? (
                        <View className="flex-1 items-center justify-center py-8">
                            <ActivityIndicator size="large" color="#f3a49d" />
                            <Typo className="text-lg mt-4">Loading folders...</Typo>
                        </View>
                    ) : (
                        <NothingHere />
                    )
                }
                onRefresh={() => {
                    loadFolders();
                }}
                refreshing={isLoading}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    padding: 16,
                    flex: folders.length === 0 ? 1 : undefined,
                }}
            />
            <View className="absolute bottom-20 right-10">
                <Animated.View
                    style={{
                        position: "absolute",
                        bottom: 70, 
                        right: 0,
                        zIndex: 1,
                        width: 150,
                        transform: [
                            {
                                translateY: menuAnimation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [10, 0], 
                                }),
                            },
                        ],
                        opacity: menuAnimation,
                    }}
                >
                    {isMenuOpen && (
                        <View
                            className="mb-2 rounded-lg"
                            style={{
                                backgroundColor: colorScheme === "dark" ? "#1f1f1f" : "white",
                                elevation: 4,
                                shadowColor: colorScheme === "dark" ? "#000" : "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                            }}
                        >
                            <TouchableOpacity
                                className="flex-row items-center p-3"
                                onPress={() => {
                                    setCreateType("file");
                                    setDialogVisible(true);
                                    toggleMenu();
                                }}
                            >
                                <MaterialIcon name="description" size={24} color="#f3a49d" />
                                <Typo className="ml-2">New File</Typo>
                            </TouchableOpacity>

                            <View className="h-[1px] bg-gray-200" />
                            <TouchableOpacity
                                className="flex-row items-center p-3"
                                onPress={() => {
                                    setCreateType("folder");
                                    setDialogVisible(true);
                                    toggleMenu();
                                }}
                            >
                                <MaterialIcon name="create-new-folder" size={24} color="#f3a49d" />
                                <Typo className="ml-2">New Folder</Typo>
                            </TouchableOpacity>
                        </View>
                    )}
                </Animated.View>

                <TouchableOpacity
                    onPress={toggleMenu}
                    className="bg-[#f3a49d] w-16 h-16 rounded-full items-center justify-center"
                    style={{
                        elevation: 8,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4.65,
                        zIndex: 2,
                    }}
                >
                    <Animated.View
                        style={{
                            width: 30,
                            height: 30,
                            alignItems: "center",
                            justifyContent: "center",
                            transform: [
                                {
                                    rotate: menuAnimation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ["0deg", "45deg"],
                                    }),
                                },
                            ],
                        }}
                    >
                        <MaterialIcon name="add" size={30} color="white" />
                    </Animated.View>
                </TouchableOpacity>
            </View>
            <CreateDialog
                visible={dialogVisible}
                onClose={() => setDialogVisible(false)}
                onSubmit={handleCreate}
                type={createType}
                label={`Create New ${createType.charAt(0).toUpperCase() + createType.slice(1)}`}
                success="Create"
                placeholder={`Enter ${createType.charAt(0).toUpperCase() + createType.slice(1)} Name`}
            />
        </ScreenContent>
    );
}