using System;
using System.Text;
using Common;
using TheraEngine.Assets.Content;

namespace World_Of_Sea_Battle.Constants;

public static class StringHelper
{
	public static string GetValueOfK(int _007B275_007D)
	{
		return (_007B275_007D < 1000) ? _007B275_007D.ToString() : ((_007B275_007D >= 1000000) ? (roundHelperK((double)_007B275_007D / 1000000.0) + "kk") : (roundHelperK((double)_007B275_007D / 1000.0) + "k"));
	}

	public static string BigValueHelper(int _007B276_007D)
	{
		string text = ((_007B276_007D < 10000 && _007B276_007D > -10000) ? _007B276_007D.ToString() : $"{_007B276_007D:#,0}");
		return text.Replace('\u00a0', ',').Replace(' ', ',');
	}

	private static string roundHelperK(double _007B277_007D)
	{
		if (_007B277_007D >= 100.0)
		{
			return $"{Math.Round(_007B277_007D)}";
		}
		double num = Math.Round(_007B277_007D, 1);
		return (num == Math.Round(num)) ? $"{num},0" : $"{num}";
	}

	public static string ToRoman(int _007B278_007D)
	{
		if (_007B278_007D < 0 || _007B278_007D > 3999)
		{
			throw new ArgumentOutOfRangeException("insert value betwheen 1 and 3999");
		}
		if (_007B278_007D < 1)
		{
			return string.Empty;
		}
		if (_007B278_007D >= 1000)
		{
			return "M" + ToRoman(_007B278_007D - 1000);
		}
		if (_007B278_007D >= 900)
		{
			return "CM" + ToRoman(_007B278_007D - 900);
		}
		if (_007B278_007D >= 500)
		{
			return "D" + ToRoman(_007B278_007D - 500);
		}
		if (_007B278_007D >= 400)
		{
			return "CD" + ToRoman(_007B278_007D - 400);
		}
		if (_007B278_007D >= 100)
		{
			return "C" + ToRoman(_007B278_007D - 100);
		}
		if (_007B278_007D >= 90)
		{
			return "XC" + ToRoman(_007B278_007D - 90);
		}
		if (_007B278_007D >= 50)
		{
			return "L" + ToRoman(_007B278_007D - 50);
		}
		if (_007B278_007D >= 40)
		{
			return "XL" + ToRoman(_007B278_007D - 40);
		}
		if (_007B278_007D >= 10)
		{
			return "X" + ToRoman(_007B278_007D - 10);
		}
		if (_007B278_007D >= 9)
		{
			return "IX" + ToRoman(_007B278_007D - 9);
		}
		if (_007B278_007D >= 5)
		{
			return "V" + ToRoman(_007B278_007D - 5);
		}
		if (_007B278_007D >= 4)
		{
			return "IV" + ToRoman(_007B278_007D - 4);
		}
		if (_007B278_007D >= 1)
		{
			return "I" + ToRoman(_007B278_007D - 1);
		}
		throw new ArgumentOutOfRangeException("something bad happened");
	}

	private static string time2char(int _007B279_007D)
	{
		return (_007B279_007D < 10) ? ("0" + _007B279_007D) : _007B279_007D.ToString();
	}

	public static string TimeMMMSS(double _007B280_007D)
	{
		TimeSpan timeSpan = TimeSpan.FromSeconds(Math.Max(0.0, _007B280_007D));
		return ((timeSpan.Hours > 0) ? (time2char(timeSpan.Hours) + ":") : string.Empty) + time2char(timeSpan.Minutes) + ":" + time2char(timeSpan.Seconds);
	}

	public static string TimeDHM(double _007B281_007D, bool _007B282_007D = false)
	{
		TimeSpan timeSpan = TimeSpan.FromSeconds(Math.Max(0.0, _007B281_007D));
		int num = timeSpan.Hours;
		if (_007B282_007D)
		{
			num += timeSpan.Days * 24;
		}
		int num2 = Math.Max((timeSpan.Seconds > 0) ? 1 : 0, timeSpan.Minutes);
		string text = ((num == 0) ? string.Empty : (time2char(num) + Local.StringConstants_64));
		text += ((num != 0) ? (time2char(num2) + Local.StringConstants_65) : ((num2 == 0) ? string.Empty : (num2 + Local.StringConstants_66_B)));
		if (timeSpan.Days > 0 && !_007B282_007D)
		{
			text = timeSpan.Days + Local.StringConstants_66(text);
		}
		return text;
	}

	public static string TimeD(double _007B283_007D)
	{
		double num = _007B283_007D / 24.0 / 3600.0;
		if (num > 10.0)
		{
			return (int)Math.Round(num) + " " + Local.days;
		}
		return Math.Round(num, 1) + " " + Local.days;
	}

	public static string pn(float _007B284_007D)
	{
		return (_007B284_007D > 0f) ? ("+" + _007B284_007D) : _007B284_007D.ToString();
	}

	public static string TrimByLength(CustomSpriteFont _007B285_007D, string _007B286_007D, float _007B287_007D)
	{
		//IL_0003: Unknown result type (might be due to invalid IL or missing references)
		//IL_0027: Unknown result type (might be due to invalid IL or missing references)
		//IL_0065: Unknown result type (might be due to invalid IL or missing references)
		if (_007B285_007D.Measure(_007B286_007D).X <= _007B287_007D)
		{
			return _007B286_007D;
		}
		string text = "...";
		float x = _007B285_007D.Measure(text).X;
		if (_007B287_007D < x)
		{
			return text;
		}
		StringBuilder stringBuilder = new StringBuilder(_007B286_007D);
		while (stringBuilder.Length > 0)
		{
			stringBuilder.Length--;
			if (_007B285_007D.Measure(stringBuilder.ToString()).X + x <= _007B287_007D)
			{
				return stringBuilder.ToString().TrimEnd() + text;
			}
		}
		return text;
	}

	public static string SplitAroundMiddleSpace(string _007B288_007D)
	{
		if (string.IsNullOrWhiteSpace(_007B288_007D))
		{
			return _007B288_007D;
		}
		int num = _007B288_007D.Length / 2;
		int _007B289_007D = _007B288_007D.LastIndexOf(' ', num, num);
		int _007B290_007D = _007B288_007D.IndexOf(' ', num);
		int num2 = PickBestSplit(_007B289_007D, _007B290_007D, num);
		return (num2 == -1) ? _007B288_007D : _007B288_007D.Remove(num2, 1).Insert(num2, Environment.NewLine);
	}

	private static int PickBestSplit(int _007B289_007D, int _007B290_007D, int _007B291_007D)
	{
		if (_007B289_007D == -1 && _007B290_007D == -1)
		{
			return -1;
		}
		if (_007B289_007D == -1)
		{
			return _007B290_007D;
		}
		if (_007B290_007D == -1)
		{
			return _007B289_007D;
		}
		return (_007B291_007D - _007B289_007D <= _007B290_007D - _007B291_007D) ? _007B289_007D : _007B290_007D;
	}
}
