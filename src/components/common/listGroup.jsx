import React from "react";

const ListGroup = ({
  items,
  textProperty,
  valueProperty,
  onItemSelect,
  selectedItem,
}) => {
  return (
    <ul className="list-group">
      <li className="list-group-item text-light bg-dark">分類</li>
      {items.map((g) => (
        <li
          onClick={() => onItemSelect(g)}
          key={g[valueProperty] || "idForAllGenre"}
          className={
            g === selectedItem ? "active list-group-item" : "list-group-item"
          }
          //style={{ cursor: "pointer" }} //鼠標在上面會顯示手指
        >
          {g[textProperty]}
        </li>
      ))}
    </ul>
  );
};

ListGroup.defaultProps = {
  //預設props值，如果有指定值會覆寫
  textProperty: "name",
  valueProperty: "_id",
};

export default ListGroup;
