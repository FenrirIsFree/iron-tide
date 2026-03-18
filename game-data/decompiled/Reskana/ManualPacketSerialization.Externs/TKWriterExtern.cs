using System;
using System.Collections.Generic;
using ManualPacketSerialization.Formatters;

namespace ManualPacketSerialization.Externs;

public struct TKWriterExtern
{
	internal WriterExtern writer;

	internal TKWriterExtern(WriterExtern _007B10965_007D)
	{
		writer = _007B10965_007D;
	}

	public void WriteStruct<T>(short _007B10966_007D, in T _007B10967_007D) where T : unmanaged
	{
		TKObjectFormatter.BeginPackSectionData(this, _007B10966_007D);
		int position = writer.Position;
		writer.WriteStruct(_007B10967_007D);
		TKObjectFormatter.EndPackSectionData(this, position);
	}

	public void Write(short _007B10968_007D, string _007B10969_007D)
	{
		TKObjectFormatter.BeginPackSectionData(this, _007B10968_007D);
		int position = writer.Position;
		StringFormatter.Pack(writer, _007B10969_007D);
		TKObjectFormatter.EndPackSectionData(this, position);
	}

	public void WriteByte(short _007B10970_007D, byte _007B10971_007D)
	{
		TKObjectFormatter.BeginPackSectionData(this, _007B10970_007D);
		int position = writer.Position;
		writer.WriteByte(_007B10971_007D);
		TKObjectFormatter.EndPackSectionData(this, position);
	}

	public void WriteEnum(short _007B10972_007D, object _007B10973_007D)
	{
		TKObjectFormatter.BeginPackSectionData(this, _007B10972_007D);
		int position = writer.Position;
		writer.WriteEnum(_007B10973_007D);
		TKObjectFormatter.EndPackSectionData(this, position);
	}

	public void WriteByte32bitSize(short _007B10974_007D, byte[] _007B10975_007D)
	{
		TKObjectFormatter.BeginPackSectionData(this, _007B10974_007D);
		int position = writer.Position;
		writer.WriteBytes32bitSize(_007B10975_007D);
		TKObjectFormatter.EndPackSectionData(this, position);
	}

	public void Write(short _007B10976_007D, bool _007B10977_007D)
	{
		TKObjectFormatter.BeginPackSectionData(this, _007B10976_007D);
		int position = writer.Position;
		writer.Write(_007B10977_007D);
		TKObjectFormatter.EndPackSectionData(this, position);
	}

	public void Write<T>(short _007B10978_007D, T _007B10979_007D) where T : class, ITKSerializable
	{
		TKObjectFormatter.BeginPackSectionData(this, _007B10978_007D);
		int position = writer.Position;
		ReferenceTKObjectFormatter.Pack(this, _007B10979_007D);
		TKObjectFormatter.EndPackSectionData(this, position);
	}

	public void WriteXXX<T>(short _007B10980_007D, ref T _007B10981_007D) where T : struct, ITKSerializable
	{
		TKObjectFormatter.BeginPackSectionData(this, _007B10980_007D);
		int position = writer.Position;
		TKObjectFormatter.Pack(this, ref _007B10981_007D);
		TKObjectFormatter.EndPackSectionData(this, position);
	}

	public void WriteIMP<T>(short _007B10982_007D, T _007B10983_007D) where T : class, IMPSerializable
	{
		TKObjectFormatter.BeginPackSectionData(this, _007B10982_007D);
		int position = writer.Position;
		ReferenceObjectFormatter.Pack(writer, _007B10983_007D);
		TKObjectFormatter.EndPackSectionData(this, position);
	}

	public void WriteIMP<T>(short _007B10984_007D, ref T _007B10985_007D) where T : struct, IMPSerializable
	{
		TKObjectFormatter.BeginPackSectionData(this, _007B10984_007D);
		int position = writer.Position;
		_007B10985_007D.Boxing(writer);
		TKObjectFormatter.EndPackSectionData(this, position);
	}

	public void WriteMPArray<T>(short _007B10986_007D, T[] _007B10987_007D, int _007B10988_007D) where T : class, IMPSerializable
	{
		TKObjectFormatter.BeginPackSectionData(this, _007B10986_007D);
		int position = writer.Position;
		writer.WriteStruct(_007B10988_007D);
		for (int i = 0; i < _007B10988_007D; i++)
		{
			writer.Write(_007B10987_007D[i]);
		}
		TKObjectFormatter.EndPackSectionData(this, position);
	}

	public void WriteDynamicTKArray<T>(short _007B10989_007D, T[] _007B10990_007D, int _007B10991_007D) where T : class, ITKSerializable
	{
		TKObjectFormatter.BeginPackSectionData(this, _007B10989_007D);
		int position = writer.Position;
		writer.WriteStruct((short)_007B10991_007D);
		for (int i = 0; i < _007B10991_007D; i++)
		{
			ReferenceTKObjectFormatter.Pack(this, _007B10990_007D[i]);
		}
		TKObjectFormatter.EndPackSectionData(this, position);
	}

	public void WriteDynamicTKArrayLarge<T>(short _007B10992_007D, T[] _007B10993_007D, int _007B10994_007D) where T : class, ITKSerializable
	{
		TKObjectFormatter.BeginPackSectionData(this, _007B10992_007D);
		int position = writer.Position;
		writer.WriteStruct(_007B10994_007D);
		for (int i = 0; i < _007B10994_007D; i++)
		{
			ReferenceTKObjectFormatter.Pack(this, _007B10993_007D[i]);
		}
		TKObjectFormatter.EndPackSectionData(this, position);
	}

	public void WriteDict<K, V>(short _007B10995_007D, Dictionary<K, V> _007B10996_007D) where K : unmanaged where V : unmanaged
	{
		TKObjectFormatter.BeginPackSectionData(this, _007B10995_007D);
		int position = writer.Position;
		writer.WriteStruct(_007B10996_007D.Count);
		foreach (var (_007B11018_007D, _007B11018_007D2) in _007B10996_007D)
		{
			writer.WriteStruct(_007B11018_007D);
			writer.WriteStruct(_007B11018_007D2);
		}
		TKObjectFormatter.EndPackSectionData(this, position);
	}

	public void WriteDict<V>(short _007B10997_007D, Dictionary<string, V> _007B10998_007D) where V : unmanaged
	{
		TKObjectFormatter.BeginPackSectionData(this, _007B10997_007D);
		int position = writer.Position;
		writer.WriteStruct(_007B10998_007D.Count);
		foreach (var (_007B11030_007D, _007B11018_007D) in _007B10998_007D)
		{
			writer.Write(_007B11030_007D);
			writer.WriteStruct(_007B11018_007D);
		}
		TKObjectFormatter.EndPackSectionData(this, position);
	}

	public void WriteDict(short _007B10999_007D, Dictionary<string, string> _007B11000_007D)
	{
		TKObjectFormatter.BeginPackSectionData(this, _007B10999_007D);
		int position = writer.Position;
		writer.WriteStruct(_007B11000_007D.Count);
		foreach (var (_007B11030_007D, _007B11030_007D2) in _007B11000_007D)
		{
			writer.Write(_007B11030_007D);
			writer.Write(_007B11030_007D2);
		}
		TKObjectFormatter.EndPackSectionData(this, position);
	}

	public void ExternalSizeTest()
	{
	}

	public void WriteContent(short _007B11001_007D, Action<WriterExtern> _007B11002_007D)
	{
		TKObjectFormatter.BeginPackSectionData(this, _007B11001_007D);
		int position = writer.Position;
		_007B11002_007D(writer);
		TKObjectFormatter.EndPackSectionData(this, position);
	}
}
