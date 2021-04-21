import React, { Component } from "react";
import _ from "lodash";

class TableBody extends Component {
  renderCell = (item, column) => {
    if (column.content) return column.content(item); //傳入非data的功能（liked, delete）
    return _.get(item, column.path); //這裡不能用item[column.path]因為有path是nest結構，裏面有“.”號會出錯，所以要用lodash的get來取得
  };

  createKey = (item, column) => item._id + (column.path || column.key);

  render() {
    const { data, columns } = this.props;

    return (
      <tbody>
        {data.map((item) => (
          <tr key={item._id}>
            {columns.map((column) => (
              <td key={this.createKey(item, column)}>
                {this.renderCell(item, column)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }
}

export default TableBody;
