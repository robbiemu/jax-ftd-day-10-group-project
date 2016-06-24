package com.cooksys.ftd.chat.server;

import com.cooksys.ftd.chat.server.Server;

import java.io.IOException;

import com.cooksys.ftd.chat.server.ClientHandler;

public class CommandParser {
	private static Server server;
	
	public CommandParser(Server server) {
		super();
		CommandParser.setServer(server);
	}
	
	public static boolean parseCommand(String cmd, ClientHandler clientHandler) throws InterruptedException, IOException {
		char delimiter = ' ';
		int delim = cmd.indexOf(delimiter);
		
		String command = cmd;
		
		if (delim != -1)
			command = cmd.substring(delim);
		
		switch (command) {
		case "/end": getServer().close(clientHandler); return true;
		case "/users": getServer().listUsers(clientHandler); return true;
		default: return false;
		}
	}

	public static Server getServer() {
		return server;
	}

	public static void setServer(Server server) {
		CommandParser.server = server;
	}
}
