import { fetchSatellitePosition } from "../api/satelliteService";
import { SatellitePosition } from "../models/SatellitePosition";

export class SatellitePresenter {
  constructor(view) {
    this.view = view;
  }

  async loadPosition() {
    try {
      const data = await fetchSatellitePosition();
      const position = new SatellitePosition(
        data.satlatitude,
        data.satlongitude,
        data.sataltitude,
        data.timestamp
      );
      this.view.updatePosition(position);
    } catch (error) {
      this.view.showError(error);
    }
  }
}
