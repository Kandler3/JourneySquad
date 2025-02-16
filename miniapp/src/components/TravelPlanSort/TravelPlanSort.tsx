import { FC, Dispatch, SetStateAction } from "react";
import { Modal, Button } from "@telegram-apps/telegram-ui";
import { ModalHeader } from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import { SectionHeader } from "@telegram-apps/telegram-ui/dist/components/Blocks/Section/components/SectionHeader/SectionHeader";
import "./TravelPlanSort.css";

type TravelPlanSortProps = {
  isSortOpened: boolean;
  setIsSortOpened: Dispatch<SetStateAction<boolean>>;
  ageSortOrder: string;
  setAgeSortOrder: Dispatch<SetStateAction<string>>;
  countrySortOrder: string;
  setCountrySortOrder: Dispatch<SetStateAction<string>>;
  dateSortOrder: string;
  setDateSortOrder: Dispatch<SetStateAction<string>>;
  saveSortChanges: (ageSortOrder: string, countrySortOrder: string, dateSortOrder: string) => void;
};

export const TravelPlanSort: FC<TravelPlanSortProps> = ({
  isSortOpened,
  setIsSortOpened,
  ageSortOrder,
  setAgeSortOrder,
  countrySortOrder,
  setCountrySortOrder,
  dateSortOrder,
  setDateSortOrder,
  saveSortChanges
}) => {
  const resetOtherSorts = (currentSort: string) => {
    if (currentSort !== "age") setAgeSortOrder("");
    if (currentSort !== "country") setCountrySortOrder("");
    if (currentSort !== "date") setDateSortOrder("");
  };

  const handleSaveSort = () => {
    saveSortChanges(ageSortOrder, countrySortOrder, dateSortOrder);
    setIsSortOpened(false); 
  };

  return (
    <Modal
      open={isSortOpened}
      className="travel-plan-sort-modal"
      header={<ModalHeader>Сортировка</ModalHeader>}
      onOpenChange={setIsSortOpened}
    >
      <div className="travel-plan-sort-modal">
        <div className="sort-columns">
          {/* Сортировка по возрасту */}
          <div className="sort-section">
            <SectionHeader large={true}>Сортировка по возрасту</SectionHeader>
            <div className="button-group">
              <Button
                mode={ageSortOrder === "asc" ? "filled" : "outline"}
                onClick={() => {
                  setAgeSortOrder(ageSortOrder === "asc" ? "" : "asc");
                  resetOtherSorts("age");
                }}
              >
                По возрастанию
              </Button>
              <Button
                mode={ageSortOrder === "desc" ? "filled" : "outline"}
                onClick={() => {
                  setAgeSortOrder(ageSortOrder === "desc" ? "" : "desc");
                  resetOtherSorts("age");
                }}
              >
                По убыванию
              </Button>
            </div>
          </div>

          {/* Сортировка по стране */}
          <div className="sort-section">
            <SectionHeader large={true}>Сортировка по стране</SectionHeader>
            <div className="button-group">
              <Button
                mode={countrySortOrder === "asc" ? "filled" : "outline"}
                onClick={() => {
                  setCountrySortOrder(countrySortOrder === "asc" ? "" : "asc");
                  resetOtherSorts("country");
                }}
              >
                По алфавиту (А-Я)
              </Button>
              <Button
                mode={countrySortOrder === "desc" ? "filled" : "outline"}
                onClick={() => {
                  setCountrySortOrder(countrySortOrder === "desc" ? "" : "desc");
                  resetOtherSorts("country");
                }}
              >
                По алфавиту (Я-А)
              </Button>
            </div>
          </div>

          {/* Сортировка по датам */}
          <div className="sort-section">
            <SectionHeader large={true}>Сортировка по датам</SectionHeader>
            <div className="button-group">
              <Button
                mode={dateSortOrder === "asc" ? "filled" : "outline"}
                onClick={() => {
                  setDateSortOrder(dateSortOrder === "asc" ? "" : "asc");
                  resetOtherSorts("date");
                }}
              >
                Самая ближайшая
              </Button>
              <Button
                mode={dateSortOrder === "desc" ? "filled" : "outline"}
                onClick={() => {
                  setDateSortOrder(dateSortOrder === "desc" ? "" : "desc");
                  resetOtherSorts("date");
                }}
              >
                Самая поздняя
              </Button>
            </div>
          </div>
        </div>

        {/* Контейнер для кнопки "Сохранить сортировку" */}
        <div className="save-button-container">
          <Button
            className="save-button"
            onClick={handleSaveSort}
          >
            Сохранить сортировку
          </Button>
        </div>
      </div>
    </Modal>
  );
};
