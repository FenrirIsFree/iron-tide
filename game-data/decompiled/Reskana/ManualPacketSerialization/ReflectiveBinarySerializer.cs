using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using System.Text;
using Microsoft.Xna.Framework;
using TheraEngine.Collections;

namespace ManualPacketSerialization;

public class ReflectiveBinarySerializer
{
	private enum SerializerId
	{
		None,
		ObjectWithFields,
		String,
		Tlist,
		RawArray,
		EnumByte,
		EnumInt,
		EnumLong,
		Unmanaged
	}

	private class CondensedTypeInformation
	{
		public readonly Type Type;

		public readonly SerializerId Id;

		public readonly int UnmanagedTypeSize;

		public CondensedTypeInformation Subtype;

		public readonly FieldInfo[] Fields;

		public CondensedTypeInformation(Type type, SerializerId id, int unmanagedTypeSize)
		{
			Type = type;
			Id = id;
			UnmanagedTypeSize = unmanagedTypeSize;
			if (id == SerializerId.ObjectWithFields)
			{
				Fields = type.GetFields(BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic);
			}
		}

		public override string ToString()
		{
			if (Id == SerializerId.Unmanaged)
			{
				return $"{Id} {UnmanagedTypeSize}";
			}
			SerializerId id = Id;
			bool flag = (uint)(id - 3) <= 1u;
			return flag ? $"{Id} {Subtype?.Id}" : $"{Id}";
		}
	}

	private sealed class TypeWrapper<T>
	{
		public static readonly CondensedTypeInformation Matched;

		static TypeWrapper()
		{
			Matched = MatchId(typeof(T));
		}

		private static CondensedTypeInformation MatchId(Type type)
		{
			if (type == typeof(string))
			{
				return new CondensedTypeInformation(type, SerializerId.String, 0);
			}
			if (typeof(ITlist).IsAssignableFrom(type))
			{
				return new CondensedTypeInformation(type, SerializerId.Tlist, 0)
				{
					Subtype = MatchId(type.GenericTypeArguments.First())
				};
			}
			if (type.IsSubclassOf(typeof(Array)))
			{
				return new CondensedTypeInformation(type, SerializerId.RawArray, 0)
				{
					Subtype = MatchId(type.GetElementType())
				};
			}
			if (type.IsEnum)
			{
				ulong num = 0uL;
				foreach (ulong value in Enum.GetValues(type))
				{
					num = Math.Max(value, num);
				}
				int id;
				if (num > 255)
				{
					if (num > uint.MaxValue)
					{
						if (num > ulong.MaxValue)
						{
							throw new NotSupportedException();
						}
						id = 7;
					}
					else
					{
						id = 6;
					}
				}
				else
				{
					id = 5;
				}
				return new CondensedTypeInformation(type, (SerializerId)id, 0);
			}
			if (type.IsClass || typeof(IMPSerializable).IsAssignableFrom(type))
			{
				return new CondensedTypeInformation(type, SerializerId.ObjectWithFields, 0);
			}
			return new CondensedTypeInformation(type, SerializerId.Unmanaged, Marshal.SizeOf(type));
		}
	}

	private byte[] baseArray;

	private BinaryWriter writer;

	private BinaryReader reader;

	private static readonly Encoding StringEncoding;

	private static CondensedTypeInformation RequestTypeWrapper(Type target)
	{
		return (CondensedTypeInformation)typeof(TypeWrapper<>).MakeGenericType(target).GetField("Matched", BindingFlags.Static | BindingFlags.Public).GetValue(null);
	}

	private static bool IsNullable(Type type)
	{
		if (type.IsClass && type != typeof(string))
		{
			return !type.IsArray;
		}
		return false;
	}

	public void test()
	{
		//IL_00e6: Unknown result type (might be due to invalid IL or missing references)
		//IL_00eb: Unknown result type (might be due to invalid IL or missing references)
		//IL_0101: Unknown result type (might be due to invalid IL or missing references)
		//IL_0106: Unknown result type (might be due to invalid IL or missing references)
		baseArray = new byte[12222];
		writer = new BinaryWriter(new MemoryStream(baseArray));
		reader = new BinaryReader(new MemoryStream(baseArray));
		Tester tester = new Tester();
		tester.Field1 = new Tlist<int> { 12, 124, 214 };
		tester.Field2 = "23fe ыупшщцоуп 1324";
		tester.Field3 = true;
		tester.Field1B = new Tlist<string> { "awfw", "wegweg", "weweg" };
		tester.Field1C = new Tlist<Tester2>();
		for (int i = 0; i < 10; i++)
		{
			tester.Field1C.Add(new Tester2
			{
				Position = new Vector2(1f, 2f),
				Rotation = new Vector3(3f, 4f, 5f)
			});
		}
		object value = tester;
		while (true)
		{
			Stopwatch stopwatch = Stopwatch.StartNew();
			for (int j = 0; j < 1000; j++)
			{
				writer.BaseStream.Position = 0L;
				WriteObject(RequestTypeWrapper(typeof(Tester)), ref value);
			}
			stopwatch.Stop();
			_ = "1000x: " + stopwatch.Elapsed.TotalMilliseconds;
			stopwatch = Stopwatch.StartNew();
			for (int k = 0; k < 10000; k++)
			{
				reader.BaseStream.Position = 0L;
				ReadObject(RequestTypeWrapper(typeof(Tester)));
			}
			stopwatch.Stop();
			_ = "10000x: " + stopwatch.Elapsed.TotalMilliseconds;
		}
	}

	private void WriteObject(CondensedTypeInformation info, ref object value)
	{
		if (IsNullable(info.Type))
		{
			writer.Write((value != null) ? ((byte)1) : ((byte)0));
		}
		else if (value == null)
		{
			throw new InvalidOperationException();
		}
		switch (info.Id)
		{
		case SerializerId.ObjectWithFields:
		{
			FieldInfo[] fields = info.Fields;
			foreach (FieldInfo fieldInfo in fields)
			{
				if (!fieldInfo.IsNotSerialized)
				{
					Type fieldType = fieldInfo.FieldType;
					object value2 = fieldInfo.GetValue(value);
					WriteObject(RequestTypeWrapper(fieldType), ref value2);
				}
			}
			break;
		}
		case SerializerId.String:
			SerializeString((string)value);
			break;
		case SerializerId.Tlist:
		{
			ITlist tlist = (ITlist)value;
			SerializeArray(tlist.GetArray, tlist.GetSize, info);
			break;
		}
		case SerializerId.RawArray:
		{
			Array array = (Array)value;
			SerializeArray(array, array.Length, info);
			break;
		}
		case SerializerId.EnumByte:
			writer.Write((byte)value);
			break;
		case SerializerId.EnumInt:
			writer.Write((uint)value);
			break;
		case SerializerId.EnumLong:
			writer.Write((ulong)value);
			break;
		case SerializerId.Unmanaged:
			SerializeWeakStructure(value, info);
			break;
		default:
			throw new NotSupportedException();
		}
	}

	private object ReadObject(CondensedTypeInformation info)
	{
		Type type = info.Type;
		if (IsNullable(type) && reader.ReadByte() == 0)
		{
			return null;
		}
		switch (info.Id)
		{
		case SerializerId.ObjectWithFields:
		{
			object obj = Activator.CreateInstance(type);
			FieldInfo[] fields = info.Fields;
			foreach (FieldInfo fieldInfo in fields)
			{
				if (!fieldInfo.IsNotSerialized)
				{
					Type fieldType = fieldInfo.FieldType;
					object value = ReadObject(RequestTypeWrapper(fieldType));
					fieldInfo.SetValue(obj, value);
				}
			}
			return obj;
		}
		case SerializerId.String:
			return DeSerializeString();
		case SerializerId.Tlist:
		{
			Array array = DeserializeArray(info);
			return (ITlist)Activator.CreateInstance(info.Type, array);
		}
		case SerializerId.RawArray:
			return DeserializeArray(info);
		case SerializerId.EnumByte:
			return reader.ReadByte();
		case SerializerId.EnumInt:
			return reader.ReadUInt32();
		case SerializerId.EnumLong:
			return reader.ReadUInt64();
		case SerializerId.Unmanaged:
			return DeSerializeWeakStructure(info);
		default:
			throw new NotSupportedException();
		}
	}

	private void SerializeString(string value)
	{
		writer.Write(value ?? string.Empty);
	}

	private string DeSerializeString()
	{
		return reader.ReadString();
	}

	private void SerializeWeakStructure(object value, CondensedTypeInformation fieldType)
	{
		int num = (int)writer.BaseStream.Position;
		Unsafe.As<byte[], object>(ref Unsafe.AddByteOffset(ref baseArray, num)) = value;
		writer.BaseStream.Position += fieldType.UnmanagedTypeSize;
	}

	private object DeSerializeWeakStructure(CondensedTypeInformation fieldType)
	{
		int num = (int)reader.BaseStream.Position;
		object result = Unsafe.As<byte[], object>(ref Unsafe.AddByteOffset(ref baseArray, num));
		reader.BaseStream.Position += fieldType.UnmanagedTypeSize;
		return result;
	}

	private unsafe void SerializeUmnagaed<T>(ref T val) where T : unmanaged
	{
		fixed (byte* ptr = &baseArray[writer.BaseStream.Position])
		{
			*(T*)ptr = val;
		}
		writer.BaseStream.Position += sizeof(T);
	}

	private unsafe T DeSerializeUmnagaed<T>() where T : unmanaged
	{
		T result;
		fixed (byte* ptr = &baseArray[reader.BaseStream.Position])
		{
			result = *(T*)ptr;
		}
		reader.BaseStream.Position += sizeof(T);
		return result;
	}

	private void SerializeArray(Array array, int count, CondensedTypeInformation typeInfo)
	{
		writer.Write(count);
		if (typeInfo.Subtype.Id == SerializerId.Unmanaged)
		{
			int num = count * typeInfo.Subtype.UnmanagedTypeSize;
			if (writer.BaseStream.Position + num >= baseArray.Length)
			{
				throw new IndexOutOfRangeException("Buffer overflowed");
			}
			writer.BaseStream.Position += num;
		}
		else
		{
			object[] array2 = Unsafe.As<object[]>(array);
			for (int i = 0; i < count; i++)
			{
				object value = array2[i];
				WriteObject(typeInfo.Subtype, ref value);
			}
		}
	}

	private Array DeserializeArray(CondensedTypeInformation typeInfo)
	{
		int num = reader.ReadInt32();
		Array array = Array.CreateInstance(typeInfo.Subtype.Type, num);
		if (typeInfo.Subtype.Id == SerializerId.Unmanaged)
		{
			int num2 = num * typeInfo.Subtype.UnmanagedTypeSize;
			if (reader.BaseStream.Position + num2 >= baseArray.Length)
			{
				throw new IndexOutOfRangeException("Buffer out of range");
			}
			reader.BaseStream.Position += num2;
		}
		else
		{
			for (int i = 0; i < num; i++)
			{
				array.SetValue(ReadObject(typeInfo.Subtype), i);
			}
		}
		return array;
	}
}
