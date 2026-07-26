package com.kingstv.services;

import org.junit.jupiter.api.Test;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import static org.junit.jupiter.api.Assertions.*;

public class MaskingPrintStreamTest {

    @Test
    public void testMaskEmail() {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PrintStream original = new PrintStream(baos);
        MaskingPrintStream masking = new MaskingPrintStream(baos, original);

        masking.print("User email is test.user@example.com.");
        String output = baos.toString();
        assertTrue(output.contains("t***r@example.com"), "Email username should be masked: " + output);
        assertFalse(output.contains("test.user@example.com"), "Raw email should not be printed: " + output);
    }

    @Test
    public void testMaskPhone() {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PrintStream original = new PrintStream(baos);
        MaskingPrintStream masking = new MaskingPrintStream(baos, original);

        masking.print("Call me at 9876543210.");
        String output = baos.toString();
        assertTrue(output.contains("******3210"), "Phone number should be masked keeping last 4 digits: " + output);
        assertFalse(output.contains("9876543210"), "Raw phone number should not be printed: " + output);
    }

    @Test
    public void testMaskOtp() {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PrintStream original = new PrintStream(baos);
        MaskingPrintStream masking = new MaskingPrintStream(baos, original);

        masking.print("PASSWORD RESET OTP FOR test@example.com: 123456");
        String output = baos.toString();
        assertTrue(output.contains("[MASKED]"), "OTP code should be masked: " + output);
        assertFalse(output.contains("123456"), "Raw OTP code should not be printed: " + output);
    }
}
