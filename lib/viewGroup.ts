import { useState } from "react";
import View from "./view";
import useLocalStorage from "./useLocalStorage";

export default class ViewGroup {
  id;
  title;
  views;
  // setViews;
  isFirst;
  handleViewRemove;

  constructor({
    id,
    title,
    views,
    // setViews,
    isFirst,
    handleViewRemove,
  }: ViewGroupConstructor) {
    this.id = id;
    this.title = title;
    this.views = views;
    // this.setViews = setViews;
    this.isFirst = isFirst ?? false;
    this.handleViewRemove = (targViewId: string) =>
      handleViewRemove.call(this, targViewId);
  }
}

interface ViewGroupConstructor {
  id: number;
  // name: "user" | "valid";
  isFirst?: boolean;
  title: string;
  views: View[];
  // setViews: ReturnType<typeof useLocalStorage<View[]>>[1];
  handleViewRemove: (this: ViewGroup, targViewId: string) => void;
}
