import React, { useState, useEffect, useRef } from "react";
import styles from "./List.module.scss";
import ListItem from "./ListItem";

import { getStorage } from "../util/helpers";

type ListT = {
	name: string;
	id: string;
	children: ListT[];
};

type List = ListT[];

const List = () => {
	const [list, setList] = useState<List>([]);
	const [count, setUpdateCount] = useState(0);

	useEffect(() => {
		setList(getStorage());
	}, [count]);

	useEffect(() => {
		if (list?.length) {
			localStorage.setItem("list", JSON.stringify(list));
		}
	}, [list, list.length]);

	const [isDragging, setIsDragging] = useState(false);

	const [initialMousePosition, setInitialMousePosition] = useState({
		x: 0,
		y: 0,
	});

	const [initialElementPosition, setInitialElementPosition] = useState({
		x: 700,
		y: 300,
	});
	const [position, setPosition] = useState({ x: 700, y: 300 });

	const ref = useRef<HTMLDivElement>(null);

	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		setIsDragging(true);
		setInitialMousePosition({ x: e.clientX, y: e.clientY });
		setInitialElementPosition({ x: position.x, y: position.y });
	};

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (isDragging && ref.current) {
			const offsetX =
				e.clientX - initialMousePosition.x + initialElementPosition.x;
			const offsetY =
				e.clientY - initialMousePosition.y + initialElementPosition.y;
			setPosition({ x: offsetX, y: offsetY });
		}
	};

	const handleMouseUp = () => {
		setIsDragging(false);
	};

	useEffect(() => {
		document.addEventListener("mouseup", handleMouseUp);
		return () => {
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, []);

	return (
		<div className={styles.listContainer}>
			<div
				className={styles.list}
				style={{ left: position.x, top: position.y }}
				ref={ref}
			>
				{list?.map(
					({
						name,
						id,
						children,
					}: {
						name: string;
						id: string;
						children: ListT[];
					}) => (
						<ListItem
							key={id}
							id={id}
							name={name}
							onMouseDown={handleMouseDown}
							onMouseMove={handleMouseMove}
							onMouseUp={handleMouseUp}
							setUpdateCount={setUpdateCount}
							children={children}
						/>
					)
				)}
			</div>
		</div>
	);
};

export default List;
