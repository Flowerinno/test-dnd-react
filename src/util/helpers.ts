interface IListItem {
	name: string;
	id: string;
	children: IListItem[] | [];
}

type List = IListItem[];

const basicList: List = [
	{
		name: "Categories",
		id: "12345",
		children: [],
	},
];

export const getStorage = (): List => {
	const list = localStorage.getItem("list");

	if (list === null || list === undefined || JSON.parse(list).length === 0) {
		setStorage();
		return getStorage();
	}

	const parsedList: List = JSON.parse(list);

	return parsedList;
};

export const setStorage = (list: List = basicList) => {
	localStorage.setItem("list", JSON.stringify(list));
};

export const updateListItem = (
	id: string,
	newName: string,
	list: List = getStorage()
): List => {
	const updatedList = list.map((item: IListItem) => {
		if (item.id === id) {
			return {
				...item,
				name: newName,
			};
		} else if (item.children && item.children.length > 0) {
			return {
				...item,
				children: updateListItem(id, newName, item.children),
			};
		}
		return item;
	});

	setStorage(updatedList);

	return updatedList;
};

export const removeItem = (
	id: string,
	list: List = getStorage(),
	parent?: IListItem
): List => {
	for (let i = 0; i < list.length; i++) {
		const item = list[i];
		if (item.id === id) {
			if (parent) {
				parent.children = parent.children.filter((child) => child.id !== id);
			} else {
				list.splice(i, 1);
			}
			break;
		} else if (item.children && item.children.length > 0) {
			removeItem(id, item.children, item);
		}
	}

	if (!parent) {
		setStorage(list);
	}

	return list;
};

export const addChildToItemByName = (
	itemName: string | null = null,
	itemId: string,
	list?: IListItem[]
) => {
	const existingList = list || getStorage();

	const updatedList: IListItem[] = existingList.map((item: IListItem) => {
		if (item.id === itemId) {
			const newChild: IListItem = {
				name: itemName || "",
				id: generateRandomId(),
				children: [],
			};

			return {
				...item,
				children: item.children.length
					? [...item.children, newChild]
					: [newChild],
			};
		} else if (item.children && item.children.length > 0) {
			return {
				...item,
				children: addChildToItemByName(itemName, itemId, item.children),
			};
		}

		return item;
	});

	if (!list) {
		setStorage(updatedList);
	}

	return updatedList;
};

export const generateRandomId = (): string => {
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let randomId = "";

	for (let i = 0; i < 10; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		randomId += characters.charAt(randomIndex);
	}

	return randomId;
};
