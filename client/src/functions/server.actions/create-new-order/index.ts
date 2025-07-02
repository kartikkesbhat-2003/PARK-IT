

interface ICreateNewOrderPayload {
    vehicleType: string;
    startTime: string;
    endTime: string;
    vehicleNumber: string;
    userId: string;
    parkingId: string;
    
}

export const createNewOrder=async()=>{
    const serverResponse = await fetch(`${envConfig.SERVER_BASE_URL}/parking/create-new-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return serverResponse.json().then(
      (data) => {
        return data;
      },
      (error) => {
        throw error;
      }
    );
}