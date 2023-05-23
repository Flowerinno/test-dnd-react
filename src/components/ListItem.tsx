import React, { useState, useRef, useEffect } from "react";
import plusIcon from "../assets/plus.svg";
import deleteIcon from "../assets/delete.svg";
import editIcon from "../assets/edit.svg";
import doneIcon from "../assets/done.svg";
import cancelIcon from "../assets/cancel.svg";

import {
	updateListItem,
	removeItem,
	addChildToItemByName,
} from "../util/helpers";

import styles from "./ListItem.module.scss";

interface ListItem {
	name: string;
	id: string;
	children: ListItem[] | [];
}

interface ListItemProps {
	name: string;
	id: string;
	children: ListItem[] | [];
	onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
	onMouseUp: (e: React.MouseEvent<HTMLDivElement>) => void;
	onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
	setUpdateCount: React.Dispatch<React.SetStateAction<number>>;
	index?: number;
}

const ListItem: React.FC<ListItemProps> = ({
	name,
	id,
	children,
	onMouseDown,
	onMouseUp,
	onMouseMove,
	setUpdateCount,
	index,
}) => {
	const ref = useRef<HTMLInputElement>(null);

	const [isEditting, setIsEditting] = useState(false);

	const addHandler = () => {
		addChildToItemByName("", id);
		setUpdateCount((prevCount) => prevCount + 1);
	};

	const editHandler = () => {
		setIsEditting(!isEditting);
	};

	const updateHandler = (value: string, id: string) => {
		if (ref.current) {
			updateListItem(id, value);
			editHandler();
			setUpdateCount((prevCount) => prevCount + 1);
		}
	};

	const deleteHandler = (id: string) => {
		removeItem(id);
		setUpdateCount((prevCount) => prevCount + 1);
	};

	let direction = "";
	if (index && index !== 0) {
		direction = "left";
	}

	return (
		<div
			className={styles.listItem}
			onMouseDown={onMouseDown}
			onMouseUp={onMouseUp}
			onMouseMove={onMouseMove}
		>
			<div className={styles.util}>
				{!isEditting ? (
					<span
						className={`${styles.name} 
					${children.length >= 1 ? styles.vertical : ""}
					${name !== "Categories" && styles[direction]}`}
					>
						{name}
					</span>
				) : (
					<input
						ref={ref}
						className={styles.name}
						type="text"
						placeholder="edit"
					/>
				)}
				{!isEditting ? (
					<div className={styles.notEditing}>
						<img
							src={plusIcon}
							alt="add"
							width="24"
							height="24"
							onClick={addHandler}
						/>

						<img
							src={editIcon}
							alt="edit"
							width="24"
							height="24"
							onClick={editHandler}
						/>
						<img
							src={deleteIcon}
							alt="delete"
							width="24"
							height="24"
							onClick={() => deleteHandler(id)}
						/>
					</div>
				) : (
					<div className={styles.editing}>
						<img
							src={cancelIcon}
							width="24"
							height="24"
							onClick={editHandler}
						/>
						<img
							src={doneIcon}
							width="24"
							height="24"
							onClick={() => updateHandler(ref.current!.value, id)}
						/>
					</div>
				)}
			</div>

			<div className={styles.childrenNodes}>
				{children?.length > 0 &&
					children?.map((item, index) => (
						<ListItem
							key={item.id}
							id={item.id}
							name={item.name}
							onMouseDown={onMouseDown}
							onMouseMove={onMouseMove}
							onMouseUp={onMouseUp}
							setUpdateCount={setUpdateCount}
							children={item.children}
							index={index}
						/>
					))}
			</div>
		</div>
	);
};

export default ListItem;
