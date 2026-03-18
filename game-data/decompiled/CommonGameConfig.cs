using System;
using System.Text;
using ManualPacketSerialization;
using ManualPacketSerialization.Externs;

namespace Common;

public sealed class CommonGameConfig : IMPSerializable
{
	public static CommonGameConfig CurrentSettings = new CommonGameConfig();

	public float TimeSpeed;

	public float WindRefreshTimer;

	public float WeatherRefreshTimer;

	public float SpecialMsgTimer;

	public string BillingApiAddress;

	public float ExperimentalShipLinearSpeed;

	public float ExperimentalShipAxisSpeed;

	public float ExperimentalCannonBallsSpeed;

	public float ExperimentalCannonBallsDistance;

	public float ExperimentalShipSpeedChange;

	public float MonetsPriceInRUB;

	public float MonetsPriceInUSD;

	public float MonetsPriceInUAH;

	public float MonetsPriceInUAH_steam;

	public float ChanseXsollaForRubles;

	public float ChanseVkToXsTop30;

	public float ChanseVkToXsAll;

	public float ChanseSteamToXsTop30;

	public float ChanseSteamToXsAll;

	public string VKPlayGMRID;

	public string VKPlayGCID;

	public string VKPlayBillingUrl;

	public string VKPlaySecret;

	public string XsollaApiEndPoint;

	public string XsollaPaymentGatePath;

	public string XsollaToken;

	public string RobokassaApiUrl;

	public string RobokassaLogin;

	public string RobokassaPassword;

	public string PublicDesignsCdnAddress;

	public DateTime FirstSeasonStartDate;

	public string ConsolePass;

	public CommonGameConfig()
	{
		TimeSpeed = 1f;
		WindRefreshTimer = 540f;
		WeatherRefreshTimer = 59f;
		SpecialMsgTimer = 1500f;
		ExperimentalShipLinearSpeed = 0.95f;
		ExperimentalShipAxisSpeed = 0.95f;
		ExperimentalCannonBallsSpeed = 1f;
		ExperimentalCannonBallsDistance = 1f;
		ExperimentalShipSpeedChange = 1f;
		ChanseXsollaForRubles = 0f;
		ChanseVkToXsTop30 = 0f;
		FirstSeasonStartDate = new DateTime(2024, 12, 1);
	}

	private void _007B400_007D(WriterExtern _007B401_007D)
	{
		_007B401_007D.WriteStruct<float>(ref TimeSpeed);
		_007B401_007D.WriteStruct<float>(ref WindRefreshTimer);
		_007B401_007D.WriteStruct<float>(ref WeatherRefreshTimer);
		_007B401_007D.WriteStruct<float>(ref SpecialMsgTimer);
		_007B401_007D.Write(BillingApiAddress, (Encoding)null);
		_007B401_007D.WriteStruct<float>(ref ExperimentalShipLinearSpeed);
		_007B401_007D.WriteStruct<float>(ref ExperimentalShipAxisSpeed);
		_007B401_007D.WriteStruct<float>(ref ExperimentalCannonBallsSpeed);
		_007B401_007D.WriteStruct<float>(ref ExperimentalCannonBallsDistance);
		_007B401_007D.WriteStruct<float>(ref ExperimentalShipSpeedChange);
		_007B401_007D.WriteStruct<float>(MonetsPriceInUSD);
		_007B401_007D.WriteStruct<float>(MonetsPriceInRUB);
		_007B401_007D.WriteStruct<float>(MonetsPriceInUAH);
		_007B401_007D.WriteStruct<float>(MonetsPriceInUAH_steam);
		_007B401_007D.WriteStruct<float>(ChanseXsollaForRubles);
		_007B401_007D.WriteStruct<float>(ChanseVkToXsTop30);
		_007B401_007D.WriteStruct<float>(ChanseVkToXsAll);
		_007B401_007D.WriteStruct<float>(ChanseSteamToXsTop30);
		_007B401_007D.WriteStruct<float>(ChanseSteamToXsAll);
		_007B401_007D.Write(VKPlayGMRID, (Encoding)null);
		_007B401_007D.Write(VKPlayBillingUrl, (Encoding)null);
		_007B401_007D.Write(VKPlaySecret, (Encoding)null);
		_007B401_007D.Write(XsollaApiEndPoint, (Encoding)null);
		_007B401_007D.Write(XsollaPaymentGatePath, (Encoding)null);
		_007B401_007D.Write(XsollaToken, (Encoding)null);
		_007B401_007D.Write(RobokassaApiUrl, (Encoding)null);
		_007B401_007D.Write(RobokassaLogin, (Encoding)null);
		_007B401_007D.Write(RobokassaPassword, (Encoding)null);
		_007B401_007D.Write(true);
		_007B401_007D.Write(PublicDesignsCdnAddress, (Encoding)null);
		_007B401_007D.Write(VKPlayGCID, (Encoding)null);
		_007B401_007D.WriteStruct<DateTime>(FirstSeasonStartDate);
		_007B401_007D.Write(ConsolePass, (Encoding)null);
	}

	private void _007B402_007D(WriterExtern _007B403_007D)
	{
		_007B403_007D.ReadStruct<float>(ref TimeSpeed);
		_007B403_007D.ReadStruct<float>(ref WindRefreshTimer);
		_007B403_007D.ReadStruct<float>(ref WeatherRefreshTimer);
		_007B403_007D.ReadStruct<float>(ref SpecialMsgTimer);
		_007B403_007D.ReadString(ref BillingApiAddress, (Encoding)null);
		_007B403_007D.ReadStruct<float>(ref ExperimentalShipLinearSpeed);
		_007B403_007D.ReadStruct<float>(ref ExperimentalShipAxisSpeed);
		_007B403_007D.ReadStruct<float>(ref ExperimentalCannonBallsSpeed);
		_007B403_007D.ReadStruct<float>(ref ExperimentalCannonBallsDistance);
		_007B403_007D.ReadStruct<float>(ref ExperimentalShipSpeedChange);
		_007B403_007D.ReadStruct<float>(ref MonetsPriceInUSD);
		_007B403_007D.ReadStruct<float>(ref MonetsPriceInRUB);
		_007B403_007D.ReadStruct<float>(ref MonetsPriceInUAH);
		_007B403_007D.ReadStruct<float>(ref MonetsPriceInUAH_steam);
		_007B403_007D.ReadStruct<float>(ref ChanseXsollaForRubles);
		_007B403_007D.ReadStruct<float>(ref ChanseVkToXsTop30);
		_007B403_007D.ReadStruct<float>(ref ChanseVkToXsAll);
		_007B403_007D.ReadStruct<float>(ref ChanseSteamToXsTop30);
		_007B403_007D.ReadStruct<float>(ref ChanseSteamToXsAll);
		_007B403_007D.ReadString(ref VKPlayGMRID, (Encoding)null);
		_007B403_007D.ReadString(ref VKPlayBillingUrl, (Encoding)null);
		_007B403_007D.ReadString(ref VKPlaySecret, (Encoding)null);
		_007B403_007D.ReadString(ref XsollaApiEndPoint, (Encoding)null);
		_007B403_007D.ReadString(ref XsollaPaymentGatePath, (Encoding)null);
		_007B403_007D.ReadString(ref XsollaToken, (Encoding)null);
		_007B403_007D.ReadString(ref RobokassaApiUrl, (Encoding)null);
		_007B403_007D.ReadString(ref RobokassaLogin, (Encoding)null);
		_007B403_007D.ReadString(ref RobokassaPassword, (Encoding)null);
		bool flag = default(bool);
		_007B403_007D.ReadBoolean(ref flag);
		_007B403_007D.ReadString(ref PublicDesignsCdnAddress, (Encoding)null);
		_007B403_007D.ReadString(ref VKPlayGCID, (Encoding)null);
		_007B403_007D.ReadStruct<DateTime>(ref FirstSeasonStartDate);
		_007B403_007D.ReadString(ref ConsolePass, (Encoding)null);
	}
}
