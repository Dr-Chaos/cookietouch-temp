import Account from ".";

export enum BonusPackMoney {
  KAMAS = "KMS",
  GOULTINES = "GOU"
}

export enum BonusPackDuration {
  WEEK = 7,
  MONTH = 30
}

export function buyBonusPack(
  acc: Account,
  money = BonusPackMoney.KAMAS,
  duration = BonusPackDuration.WEEK
) {
  const handleSetShopDetailsSuccess = (account: Account, message: any) => {
    account.network.send("shopOpenRequest");
    account.network.unregisterMessage(setShopDetailsSuccessHandlerID);
  };

  const setShopDetailsSuccessHandlerID = acc.network.registerMessage(
    "setShopDetailsSuccess",
    handleSetShopDetailsSuccess
  );

  const handleShopOpenSuccess = (account: Account, message: any) => {
    account.network.send("shopOpenCategoryRequest", {
      categoryId: 557,
      page: 1,
      size: 3
    });
    account.network.unregisterMessage(handleShopOpenSuccessHandlerID);
  };

  const handleShopOpenSuccessHandlerID = acc.network.registerMessage(
    "shopOpenSuccess",
    handleShopOpenSuccess
  );

  const handleShopOpenCategorySuccess = (account: Account, message: any) => {
    if (!account.data.bakHardToSoftCurrentRate) {
      return;
    }
    const choice = message.articles.find((a: any) =>
      (a.name as string).includes(duration.toString())
    );
    account.network.send("shopBuyRequest", {
      amountHard: choice.price,
      amountSoft: Math.round(
        choice.price * account.data.bakHardToSoftCurrentRate
      ),
      currency: money,
      isMysteryBox: false,
      purchase: [
        {
          id: choice.id,
          quantity: 1
        }
      ]
    });
    account.network.unregisterMessage(shopOpenCategorySuccessHandlerID);
  };

  const shopOpenCategorySuccessHandlerID = acc.network.registerMessage(
    "shopOpenCategorySuccess",
    handleShopOpenCategorySuccess
  );

  const handleShopBuySuccess = (account: Account, message: any) => {
    account.network.unregisterMessage(shopBuySuccessHandlerID);
  };

  const shopBuySuccessHandlerID = acc.network.registerMessage(
    "shopBuySuccess",
    handleShopBuySuccess
  );

  acc.network.send("setShopDetailsRequest", {});
  acc.network.send("restoreMysteryBox");
}
