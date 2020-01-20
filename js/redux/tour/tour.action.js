export const setTourId = id => {
  return {
    type: "SET_TOUR_ID",
    payload: id
  };
};

export const setTourName = name => {
  return {
    type: "SET_TOUR_NAME",
    payload: name
  };
};

export const setTourPanoPhoto = photo => {
  return {
    type: "SET_TOUR_PANO_PHOTO",
    payload: photo
  };
};

export const setTourIdUser = id => {
  return {
    type: "SET_TOUR_ID_USER",
    payload: id
  };
};
