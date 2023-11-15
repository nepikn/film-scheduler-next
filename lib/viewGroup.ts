import { useState } from "react";
import View from "./view";
import useLocalStorage from "./useLocalStorage";

export default class ViewGroup {
  title;
  views;
  setViews;
  isFirst;
  handleViewRemove;

  constructor({
    title,
    views,
    setViews,
    isFirst,
    handleViewRemove,
  }: ViewGroupConstructor) {
    this.title = title;
    this.views = views;
    this.setViews = setViews;
    this.isFirst = isFirst ?? false;
    this.handleViewRemove = (targViewId: string) =>
      handleViewRemove.call(this, targViewId);
  }
}

interface ViewGroupConstructor {
  // id: string;
  // name: string;
  isFirst?: boolean;
  title: string;
  views: View[];
  setViews: ReturnType<typeof useLocalStorage<View[]>>[1];
  handleViewRemove: (this: ViewGroup, targViewId: string) => void;
}
