import React, { useEffect, useRef, useState } from "react";
import "./index.css";

interface VisibleColumn {
  id: number;
  isVisible: boolean;
}

interface SquareProps {
  id: number;
  item: number;
  isVisible: boolean;
}

const VirtualizedList: React.FC = () => {
  const items: number[] = Array.from({ length: 1000 }, (_, index) => index);
  const itemHeight: number = 60;
  const tableColumns: number = 1000;
  const itemWidth: number = 350;

  const containerHeight: number = window.innerHeight;

  const [tableWidth, setTableWidth] = useState<number>(0);
  const [scrollTop, setScrollTop] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);

  useEffect(() => {
    const myDiv: HTMLElement | null = document.querySelector(".table-scroll");

    if (myDiv) {
      const divWidth: number = myDiv.offsetWidth;
      setTableWidth(divWidth - 350);
    }
  }, []);

  const numberOfRows: number = Math.ceil(containerHeight / itemHeight);

  const startIndex: number = Math.floor(scrollTop / itemHeight);

  const endIndex: number = Math.min(startIndex + numberOfRows, items.length);

  const visibleItems: number[] = items.slice(startIndex, endIndex);

  const invisibleItemsHeight: number =
    (startIndex + visibleItems.length - endIndex) * itemHeight;

  const startColumnIndex: number = Math.floor(scrollLeft / itemWidth);

  const endColumnIndex: number = Math.min(
    startColumnIndex + Math.ceil(tableWidth / itemWidth),
    tableColumns
  );

  const visibleColumns: VisibleColumn[] = Array.from(
    { length: tableColumns },
    (_, id) => {
      const isVisible: boolean = id >= startColumnIndex && id < endColumnIndex;
      return { id, isVisible };
    }
  );

  const handleScroll = (event: React.UIEvent<HTMLDivElement>): void => {
    setScrollTop(event.currentTarget.scrollTop);
    setScrollLeft(event.currentTarget.scrollLeft);
  };

  const tableRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null);

  return (
    <div
      className="table-scroll"
      style={{ height: `100vh`, overflowY: "scroll" }}
      onScroll={handleScroll}
      ref={tableRef}
    >
      <div
        style={{
          height: `${items.length * itemHeight}px`,
          width: `${tableColumns * itemWidth}px`,
        }}
      >
        <table>
          <thead>
            <tr>
              {Array.from({ length: tableColumns + 1 }, (_, ids) => ids).map(
                (el, id) => {
                  return (
                    <th
                      key={el}
                      style={{
                        position: "fixed",
                        width: `${itemWidth}px`,
                        height: `${itemHeight}px`,
                        bottom: "8px",
                        left:
                          id === 0 ? "0" : `${itemWidth * id - scrollLeft}px`,
                        zIndex: id === 0 ? 11 : 10,
                      }}
                    >
                      Header {el}
                    </th>
                  );
                }
              )}
            </tr>
          </thead>
          <tbody
            style={{
              position: "relative",
              height: `${visibleItems.length * itemHeight}px`,
              top: `${(startIndex + 1) * itemHeight}px`,
            }}
          >
            {visibleItems.map((item) => (
              <tr key={item} style={{ height: itemHeight }}>
                <th>First top Column {item}</th>
                {visibleColumns.map(({ id, isVisible }, visibleItemId) => {
                  return isVisible ? (
                    <td
                      key={id}
                      style={{
                        position: "absolute",
                        width: `${itemWidth}px`,
                        height: `${itemHeight}px`,
                        transform: `translateX(${itemWidth * visibleItemId}px)`,
                      }}
                    >
                      <Square id={id} item={item} isVisible={isVisible} />
                    </td>
                  ) : null;
                })}
              </tr>
            ))}
            <tr style={{ height: `${invisibleItemsHeight}px` }} />
          </tbody>
          <tfoot>
            <tr>
              {Array.from({ length: tableColumns + 1 }, (_, ids) => ids).map(
                (el, id) => {
                  return (
                    <td
                      key={id}
                      style={{
                        position: "fixed",
                        width: `${itemWidth}px`,
                        height: `${itemHeight}px`,
                        bottom: "0",
                        left:
                          id === 0 ? "1" : `${itemWidth * id - scrollLeft}px`,
                        zIndex: id === 0 ? 11 : 10,
                      }}
                    >
                      Footer {id}
                    </td>
                  );
                }
              )}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

const Square: React.FC<SquareProps> = ({ id, item }) => {
  return (
    <div>
      {id} {item}
    </div>
  );
};

export default VirtualizedList;
