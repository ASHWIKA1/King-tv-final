package com.kingstv.services;

import java.io.OutputStream;
import java.io.PrintStream;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class MaskingPrintStream extends PrintStream {
    private final PrintStream original;

    // Pattern to match email: standard email address matching
    private static final Pattern EMAIL_PATTERN = Pattern.compile("([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})");
    // Pattern to match phone numbers: 10-digit numbers with optional formatting
    private static final Pattern PHONE_PATTERN = Pattern.compile("\\b(\\+?\\d{1,3}[-.\\s]?)?\\d{10}\\b");
    // Pattern to match PASSWORD RESET OTP FOR email: otp
    private static final Pattern OTP_PLAIN_PATTERN = Pattern.compile("(PASSWORD RESET OTP FOR [^:]+: )(\\d+)", Pattern.CASE_INSENSITIVE);

    public MaskingPrintStream(OutputStream out, PrintStream original) {
        super(out, true);
        this.original = original;
    }

    private String mask(String input) {
        if (input == null) {
            return null;
        }

        // 1. Mask plain text OTP
        Matcher otpMatcher = OTP_PLAIN_PATTERN.matcher(input);
        if (otpMatcher.find()) {
            input = otpMatcher.replaceAll("$1[MASKED]");
        }

        // 2. Mask Email: keep first letter of user portion, mask rest, keep domain
        Matcher emailMatcher = EMAIL_PATTERN.matcher(input);
        StringBuilder sb = new StringBuilder();
        while (emailMatcher.find()) {
            String user = emailMatcher.group(1);
            String domain = emailMatcher.group(2);
            String maskedUser;
            if (user.length() > 2) {
                maskedUser = user.charAt(0) + "***" + user.charAt(user.length() - 1);
            } else {
                maskedUser = "***";
            }
            emailMatcher.appendReplacement(sb, maskedUser + "@" + domain);
        }
        emailMatcher.appendTail(sb);
        input = sb.toString();

        // 3. Mask Phone: keep last 4 digits, replace other digits with *
        Matcher phoneMatcher = PHONE_PATTERN.matcher(input);
        sb = new StringBuilder();
        while (phoneMatcher.find()) {
            String fullPhone = phoneMatcher.group();
            String cleanPhone = fullPhone.replaceAll("[-\\s\\+]", "");
            if (cleanPhone.length() >= 10) {
                String masked = fullPhone.substring(0, fullPhone.length() - 4).replaceAll("\\d", "*") + fullPhone.substring(fullPhone.length() - 4);
                phoneMatcher.appendReplacement(sb, masked);
            } else {
                phoneMatcher.appendReplacement(sb, fullPhone);
            }
        }
        phoneMatcher.appendTail(sb);
        input = sb.toString();

        return input;
    }

    @Override
    public void print(String s) {
        original.print(mask(s));
    }

    @Override
    public void println(String s) {
        original.println(mask(s));
    }

    @Override
    public void write(byte[] buf, int off, int len) {
        String s = new String(buf, off, len);
        String masked = mask(s);
        byte[] maskedBytes = masked.getBytes();
        original.write(maskedBytes, 0, maskedBytes.length);
    }
}
