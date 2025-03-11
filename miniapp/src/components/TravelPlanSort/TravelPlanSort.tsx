import { FC, Dispatch, SetStateAction } from "react";
import { Modal, Button } from "@telegram-apps/telegram-ui";
import { ModalHeader } from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import { SectionHeader } from "@telegram-apps/telegram-ui/dist/components/Blocks/Section/components/SectionHeader/SectionHeader";
import "./TravelPlanSort.css";
import {SaveButton} from "@/components/SaveButton/SaveButton.tsx";

type TravelPlanSortProps = {
  isSortOpened: boolean;
  setIsSortOpened: Dispatch<SetStateAction<boolean>>;
  titleSortOrder: string;
  setTitleSortOrder: Dispatch<SetStateAction<string>>;
  dateSortOrder: string;
  setDateSortOrder: Dispatch<SetStateAction<string>>;
  saveSortChanges: (countrySortOrder: string, dateSortOrder: string) => void;
};

export const TravelPlanSort: FC<TravelPlanSortProps> = ({
  isSortOpened,
  setIsSortOpened,
  titleSortOrder,
  setTitleSortOrder,
  dateSortOrder,
  setDateSortOrder,
  saveSortChanges
}) => {
  const resetOtherSorts = (currentSort: string) => {
    if (currentSort !== "title") setTitleSortOrder("");
    if (currentSort !== "date") setDateSortOrder("");
  };

  const handleSaveSort = () => {
    saveSortChanges(titleSortOrder, dateSortOrder);
    setIsSortOpened(false); 
  };

  return (
    <Modal
      open={isSortOpened}
      header={<ModalHeader>Сортировка</ModalHeader>}
      onOpenChange={setIsSortOpened}
    >
      <div className="travel-plan-sort-modal">
        <div className="sort-columns">
          {/* Сортировка по стране */}
          <div className="sort-section">
            <SectionHeader large={true}>Сортировка по названию  </SectionHeader>
            <div className="button-group">
              <Button
                mode={titleSortOrder === "asc" ? "filled" : "outline"}
                onClick={() => {
                  setTitleSortOrder(titleSortOrder === "asc" ? "" : "asc");
                  resetOtherSorts("title");
                }}
              >
                По алфавиту (А-Я)
              </Button>
              <Button
                mode={titleSortOrder === "desc" ? "filled" : "outline"}
                onClick={() => {
                  setTitleSortOrder(titleSortOrder === "desc" ? "" : "desc");
                  resetOtherSorts("title");
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
        <SaveButton onClick={handleSaveSort}>
          Сохранить сортировку
        </SaveButton>
      </div>
    </Modal>
  );
};
